import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Camera,
  HelpCircle,
  TrendingUp,
  Accessibility,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Eye,
  VolumeX,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { BrandMark } from '../../components/common/BrandMark';
import { RobotIcon } from '../../components/common/RobotIcon';
import handBackground from '../../assets/hand-background.jpg';

export const LandingPage: React.FC = () => {
  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:min-h-[640px] lg:grid-cols-[1fr_2fr]">
        <div className="relative min-h-[360px] overflow-hidden sm:min-h-[440px] lg:min-h-[640px]">
          <img
            src={handBackground}
            alt="Hand demonstrating an Indian Sign Language gesture"
            className="absolute inset-0 h-full w-full object-cover object-[center_55%]"
          />
        </div>
        <div className="flex items-center bg-[#f4f0e7] px-6 py-14 sm:px-10 lg:px-12 xl:px-20">
          <div className="mx-auto max-w-2xl">
            <h1 className="mb-6 font-playfair text-[37px] font-black leading-tight tracking-tight text-slate-900 sm:text-[49px] lg:text-[49px] xl:text-[61px]">
              Learn Indian Sign Language with{' '}
              <span className="text-indigo-600">OVIA, our one voice inclusive access platform</span>
            </h1>

            <p className="mb-8 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              OVIA is here to assist you in learning sign language and receiving academic help. Interactive lessons, practice sessions with gestures, quizzes, easy progress tracking, and our own AI tutor to help you search and learn. We'll show you the way!
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link to="/register">
                <Button size="lg" variant="primary" rightIcon={<ArrowRight className="h-5 w-5" />}>
                  Start Learning Now
                </Button>
              </Link>
              <Link to="/learn">
                <Button size="lg" variant="outline">
                  Browse Lessons
                </Button>
              </Link>
            </div>

            <div className="mt-10 flex flex-col gap-3 text-s font-medium text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-emerald-900" />
                Verified ISL Static Alphabet & Numbers
              </span>
              <span className="inline-flex items-center gap-1.5">
                <VolumeX className="h-4 w-4 text-emerald-900" />
                Audio-Free Visual Interface
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-900" />
                Privacy-Preserving Transient Frame Capture
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Problems & Why OVIA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Addressing Core Challenges in ISL Education
          </h2>
          <p className="text-lg text-slate-600 mt-3">
            Breaking down barriers that support learners to move from the read process and start understanding and practising sign language for themselves.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center mb-4">
                <Camera className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Sign Practice Challenges</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Static hand-sign recognition can be affected by lighting, camera quality, hand distance, and similarities between gestures. OVIA uses scale-invariant landmark normalization to evaluate hand shapes reliably.
              </p>
            </div>
          </Card>

          <Card className="flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center mb-4">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Connected Learning</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Rather than forcing learners to use separate platforms for lesson content, camera testing, quizzes, and help, OVIA unites all capabilities in one cohesive ecosystem.
              </p>
            </div>
          </Card>

          <Card className="flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center mb-4">
                <RobotIcon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Grounded AI Assistance</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                General LLMs can hallucinate sign instructions. OVIA's RAG AI Tutor retrieves exclusively from a curated ISL curriculum and provides direct links to verified lesson references.
              </p>
            </div>
          </Card>

          <Card className="flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mb-4">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Transparent Progress</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                When a learner struggles repeatedly with a specific sign, OVIA flags it for focused revision using real database records and transparent rules rather than black-box guesswork.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Feature Walkthrough */}
      <section className="bg-slate-100/60 py-16 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              The OVIA Learning Workflow
            </h2>
            <p className="text-lg text-slate-600 mt-2">
              Four structured steps to build real mastery in Indian Sign Language.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-bold text-lg flex items-center justify-center mb-4 shadow-md shadow-indigo-200">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Explore Lessons</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Study verified step-by-step visual breakdowns for alphabets and numbers with clear hand orientations.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-bold text-lg flex items-center justify-center mb-4 shadow-md shadow-indigo-200">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Webcam Practice</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Initiate the camera to practice hand configurations. Receive instant computer vision feedback on sign correctness.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-bold text-lg flex items-center justify-center mb-4 shadow-md shadow-indigo-200">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Assess with Quizzes</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Validate recall through multiple-choice questions and interactive camera-based sign questions.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-bold text-lg flex items-center justify-center mb-4 shadow-md shadow-indigo-200">
                4
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">AI Tutor Guidance</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Ask questions at any time. Get verified answers and references from our curated ISL knowledge base.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Accessibility Focus Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-8 lg:p-12 text-white border border-slate-800 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-indigo-300 text-xs font-semibold mb-4">
                <Accessibility className="w-4 h-4" />
                Inclusive Design Principles
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-4">
                Designed From the Ground Up for Deaf and Mute Individuals
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Unlike generic platforms that rely on sound cues or audio feedback, OVIA provides explicit visual confirmations, high-contrast modes, scalable typography, and keyboard accessibility.
              </p>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="flex items-center gap-2 text-slate-200">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Color-independent visual cues</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>High-contrast toggles</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Visible focus navigation</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Clear camera consent controls</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 max-w-sm text-center">
                <BrandMark className="mx-auto mb-4 h-16 w-16 rounded-2xl" />
                <h4 className="font-bold text-base mb-1">Join Us!</h4>
                <p className="text-sm text-slate-300 mb-4">
                  Be part of the team! learn exclusive content and explore opportunities.
                </p>
                <Link to="/register">
                  <Button variant="primary" size="sm" className="w-full">
                    Create Student Account
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
