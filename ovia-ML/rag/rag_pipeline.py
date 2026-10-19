import os
import re
import json
from typing import List, Dict, Any, Optional
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

class ISLRAGPipeline:
    def __init__(self, knowledge_path: Optional[str] = None):
        base_dir = os.path.dirname(os.path.abspath(__file__))
        self.knowledge_path = knowledge_path or os.path.join(base_dir, "knowledge_base", "isl_knowledge.json")
        self.documents: List[Dict[str, Any]] = []
        self.vectorizer = None
        self.doc_vectors = None
        self.load_knowledge_base()

    def load_knowledge_base(self):
        try:
            if os.path.exists(self.knowledge_path):
                with open(self.knowledge_path, "r", encoding="utf-8") as f:
                    self.documents = json.load(f)
                
                # Build TF-IDF vector index
                corpus = [f"{doc['title']} {doc['content']} {doc.get('sign_label', '')}" for doc in self.documents]
                self.vectorizer = TfidfVectorizer(ngram_range=(1, 2), stop_words="english")
                self.doc_vectors = self.vectorizer.fit_transform(corpus)
                print(f"[ISLRAGPipeline] Loaded {len(self.documents)} knowledge documents and built vector index.")
            else:
                print(f"[ISLRAGPipeline] Knowledge base file not found at {self.knowledge_path}")
        except Exception as e:
            print(f"[ISLRAGPipeline] Error loading knowledge base: {e}")
            self.documents = []

    def retrieve(self, query: str, top_k: int = 2) -> List[Dict[str, Any]]:
        """Retrieves top matching documents using cosine similarity over indexed knowledge."""
        if not self.documents or self.vectorizer is None or self.doc_vectors is None:
            return []

        # Check for direct keyword matches (e.g. "sign K", "number 8")
        query_upper = query.upper()
        direct_matches = []
        for doc in self.documents:
            sign_lbl = doc.get("sign_label")
            if sign_lbl:
                pattern = rf"\b{re.escape(sign_lbl)}\b"
                if re.search(pattern, query_upper):
                    direct_matches.append({**doc, "score": 0.95})

        query_vec = self.vectorizer.transform([query])
        similarities = cosine_similarity(query_vec, self.doc_vectors)[0]
        
        ranked_indices = np.argsort(similarities)[::-1]
        results = []

        # Add direct matches first if any
        for dm in direct_matches:
            if not any(r["id"] == dm["id"] for r in results):
                results.append(dm)

        for idx in ranked_indices:
            score = float(similarities[idx])
            if score > 0.08 and len(results) < top_k:
                doc = self.documents[idx]
                if not any(r["id"] == doc["id"] for r in results):
                    results.append({**doc, "score": round(score, 3)})

        return results[:top_k]

    def generate_answer(self, query: str, retrieved_docs: List[Dict[str, Any]], provider: str = "curated_fallback") -> Dict[str, Any]:
        """
        Generates a grounded answer based exclusively on retrieved verified ISL documents.
        Never fabricates sign instructions.
        """
        if not retrieved_docs:
            return {
                "answer": "I could not find verified information in OVIA's Indian Sign Language knowledge base for this question. Please ask about ISL alphabets (A-Z), numbers (1-10), practice tips, or fundamental ISL grammar.",
                "is_grounded": False,
                "sources": [],
                "suggested_signs": [],
                "provider": provider,
            }

        sources = []
        suggested_signs = []
        context_snippets = []

        for doc in retrieved_docs:
            sources.append({
                "title": doc.get("title", "Curated Reference"),
                "category": doc.get("category", "General"),
                "lesson_id": doc.get("lesson_id"),
                "sign_label": doc.get("sign_label"),
                "reference_image_url": doc.get("reference_image_url"),
                "similarity_score": doc.get("score", 0.0),
                "snippet": doc.get("content", "")[:200] + "...",
            })
            if doc.get("sign_label"):
                suggested_signs.append(doc["sign_label"])
            context_snippets.append(doc.get("content", ""))

        primary_doc = retrieved_docs[0]
        
        # Grounded answer synthesis
        answer = f"**{primary_doc['title']}**\n\n{primary_doc['content']}"
        if len(retrieved_docs) > 1:
            sec_doc = retrieved_docs[1]
            answer += f"\n\n**Additional Context ({sec_doc['title']}):**\n{sec_doc['content']}"

        answer += "\n\n*(Grounded directly from OVIA's verified ISL curriculum)*"

        return {
            "answer": answer,
            "is_grounded": True,
            "sources": sources,
            "suggested_signs": suggested_signs,
            "provider": provider,
        }

# Global singleton RAG instance
rag_pipeline = ISLRAGPipeline()
