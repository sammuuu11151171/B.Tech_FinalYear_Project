export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface Lesson {
  id: number;
  title: string;
  sign_label: string;
  category: 'alphabet' | 'number' | 'words';
  description: string;
  instructions: string;
  reference_image_url?: string;
  video_url?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  order_index: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  status?: 'not_started' | 'in_progress' | 'completed';
  completed_at?: string;
}

export interface LandmarkPoint {
  x: number;
  y: number;
  z?: number;
}

export interface TopCandidate {
  label: string;
  confidence: number;
}

export interface PredictResponse {
  predicted_sign: string | null;
  confidence: number;
  is_correct: boolean;
  status: 'success' | 'no_hand_detected' | 'low_confidence' | 'incorrect_sign' | 'model_not_configured' | 'invalid_input' | 'error';
  feedback: string;
  target_sign: string;
  top_candidates: TopCandidate[];
  inference_time_ms: number;
}

export interface QuizQuestion {
  id: number;
  question_text: string;
  question_type: 'multiple_choice' | 'sign_practice';
  options: string[];
  target_sign?: string;
  points: number;
  order_index: number;
}

export interface Quiz {
  id: number;
  title: string;
  category: 'alphabet' | 'number' | 'mixed';
  description: string;
  time_limit_seconds: number;
  passing_score: number;
  question_count: number;
  created_at: string;
}

export interface QuizDetail extends Quiz {
  questions: QuizQuestion[];
}

export interface QuestionResult {
  question_id: number;
  question_text: string;
  selected_answer: string;
  correct_answer: string;
  is_correct: boolean;
  points_earned: number;
  max_points: number;
}

export interface QuizAttempt {
  id: number;
  quiz_id: number;
  quiz_title: string;
  score: number;
  total_points: number;
  percentage: number;
  passed: boolean;
  started_at: string;
  completed_at: string;
  results: QuestionResult[];
}

export interface SignRevisionItem {
  sign_label: string;
  category: string;
  accuracy_percentage: number;
  total_attempts: number;
  failed_attempts: number;
  recommendation_reason: string;
  suggested_lesson_id?: number;
}

export interface OverallProgressStats {
  total_lessons: number;
  completed_lessons: number;
  completion_percentage: number;
  total_quizzes_attempted: number;
  average_quiz_score: number;
  total_practice_attempts: number;
  practice_accuracy_percentage: number;
}

export interface RecentActivityItem {
  id: number;
  activity_type: 'lesson_completed' | 'quiz_attempt' | 'sign_practice';
  title: string;
  description: string;
  timestamp: string;
  is_positive: boolean;
}

export interface StudentDashboardSummary {
  stats: OverallProgressStats;
  revisions_needed: SignRevisionItem[];
  recent_activities: RecentActivityItem[];
  continue_lesson?: {
    id: number;
    title: string;
    sign_label: string;
    category: string;
    difficulty: string;
  };
}

export interface SourceCitation {
  title: string;
  category: string;
  lesson_id?: number;
  sign_label?: string;
  reference_image_url?: string;
  similarity_score: number;
  snippet: string;
}

export interface ChatQueryResponse {
  session_id: number;
  answer: string;
  sources: SourceCitation[];
  suggested_signs: string[];
  is_grounded: boolean;
  provider: string;
}

export interface ChatMessage {
  id: number;
  sender: 'user' | 'tutor';
  message: string;
  retrieved_sources: SourceCitation[];
  created_at: string;
}

export interface ChatSession {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
  messages: ChatMessage[];
}

export interface SystemOverviewStats {
  total_users: number;
  student_count: number;
  teacher_count: number;
  admin_count: number;
  total_lessons: number;
  total_quizzes: number;
  total_practice_attempts: number;
  total_quiz_attempts: number;
  database_status: string;
  model_status: string;
  rag_status: string;
}

export interface AuditLog {
  id: number;
  user_id?: number;
  user_email?: string;
  action: string;
  details?: string;
  ip_address?: string;
  created_at: string;
}
