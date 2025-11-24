
import React from 'react';
import { Heart, Shield, TrendingUp, Users, BrainCircuit, Smile } from 'lucide-react';
import { Logo } from './Logo';

export const AboutUs: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Hero Section */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden text-center">
        <div className="bg-slate-900 p-12 text-white relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500 rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative z-10 flex flex-col items-center">
                <div className="mb-6 bg-white p-3 rounded-full shadow-lg">
                    <Logo variant="compact" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Built by Parents, For Aspirants.</h1>
                <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
                    A balanced approach to the IIT JEE marathon. Bridging the gap between ambition and well-being.
                </p>
            </div>
        </div>

        <div className="p-10">
            <div className="max-w-3xl mx-auto text-left space-y-6">
                <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Users className="text-bt-blue" /> The Origin Story
                </h3>
                <p className="text-gray-600 leading-relaxed">
                    This platform wasn't born in a corporate boardroom. It was created by a group of parents whose children were navigating the rigorous, often overwhelming journey of IIT JEE preparation.
                </p>
                <p className="text-gray-600 leading-relaxed">
                    We watched our kids struggle not just with Physics and Maths, but with the <strong>anxiety of disorganization</strong>. We saw the need for a tool that offers visibility into progress without the pressure of constant micromanagement. We wanted to replace "Did you study?" with "How can I support you?"
                </p>
            </div>
        </div>
      </div>

      {/* Mission & Philosophy */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-bt-blue mb-4">
                  <TrendingUp size={24} />
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-2">Data, Not Drama</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                  We believe in objective tracking. By visualizing syllabus coverage and exercise completion, we remove the guesswork and emotional friction from study updates.
              </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-4">
                  <Smile size={24} />
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-2">Mental Well-being First</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                  Burnout is the enemy. Our smart planner and timetable tools are designed to mandate <strong>breaks, sleep, and realistic goals</strong>. Success shouldn't come at the cost of health.
              </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-4">
                  <Shield size={24} />
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-2">Parent-Student Trust</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                  The "Read-Only" parent mode is intentional. It keeps parents informed but puts the student in the driver's seat, fostering responsibility and trust.
              </p>
          </div>
      </div>

      {/* Closing Statement */}
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-100 rounded-xl p-8 text-center">
          <Heart className="w-10 h-10 text-orange-500 mx-auto mb-4 fill-orange-200" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">To Every Aspirant:</h3>
          <p className="text-gray-600 italic max-w-2xl mx-auto">
              "This tracker is your mirror, not your judge. Use it to find your gaps, celebrate your small wins, and keep moving forward one day at a time. You've got this."
          </p>
      </div>

    </div>
  );
};
