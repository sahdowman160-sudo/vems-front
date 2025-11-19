import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Users, Target, Award, Zap, Heart, Star, ChevronRight, Play } from 'lucide-react';
import Footer from "../footer/footer"
import { Link } from 'react-router-dom';
import img from "../main/logo.jpg"
import { IoIosArrowBack } from 'react-icons/io';
export default function AboutUsPage() {
  const [currentStep, setCurrentStep] = useState(0);

  const teamMembers = [
    { name: "Sarah Johnson", role: "CEO & Founder", image: "👩‍💼" },
    { name: "Mike Chen", role: "CTO", image: "👨‍💻" },
    { name: "Emily Davis", role: "Design Lead", image: "👩‍🎨" },
    { name: "Alex Rodriguez", role: "Marketing Director", image: "👨‍💼" }
  ];

  const values = [
    {
      icon: <Target className="w-6 h-6 text-cyan-400" />,
      title: "Innovation First",
      description: "We push boundaries and embrace cutting-edge solutions",
      color: "from-cyan-400 to-blue-500"
    },
    {
      icon: <Users className="w-6 h-6 text-purple-400" />,
      title: "Team Collaboration",
      description: "Together we achieve more than we ever could alone",
      color: "from-purple-400 to-pink-500"
    },
    {
      icon: <Award className="w-6 h-6 text-yellow-400" />,
      title: "Excellence",
      description: "Quality is not just a goal, it's our standard",
      color: "from-yellow-400 to-orange-500"
    }
  ];

  const milestones = [
    { year: "2018", title: "Company Founded", desc: "Started with a vision to transform digital experiences" },
    { year: "2020", title: "100+ Clients", desc: "Reached our first major milestone" },
    { year: "2022", title: "Global Expansion", desc: "Opened offices in 5 countries" },
    { year: "2024", title: "Industry Leader", desc: "Recognized as top innovator in our field" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl -translate-x-48 -translate-y-48"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl translate-x-48 translate-y-48"></div>
      
      {/* Navigation */}
        <div className="relative z-10 flex items-center justify-between p-8">
              <div className="flex items-center bg-white/10 backdrop-blur-sm border border-white/20 p-[9px] rounded-[35px]">
                <Link to="/" className="text-white text-lg font-semibold mr-4">
                  <IoIosArrowBack className="text-2xl  cursor-pointer" />
                </Link>
                <Link to="/" className="text-xl font-bold text-white ">GO BACK</Link>
              </div>
              <div className="flex items-center space-x-4">
                <img src={img} alt="" className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center" />
                <h1 className="text-2xl font-bold text-white">VEMS</h1>
              </div>
            </div>


      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-2xl">
          {/* Progress Dots */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-2">
              {[0, 1, 2, 3].map((index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index <= currentStep ? 'bg-blue-400' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Glass Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl p-8 relative">
            {/* Card Content */}
            {currentStep === 0 && (
              <div className="text-center space-y-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">About Our Company</h2>
                <p className="text-white/70 text-lg leading-relaxed">
                  We are a passionate team of innovators, designers, and developers committed to creating exceptional digital experiences that transform businesses and delight users.
                </p>
                <div className="grid grid-cols-3 gap-4 mt-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">500+</div>
                    <div className="text-white/60 text-sm">Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">50+</div>
                    <div className="text-white/60 text-sm">Team Members</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cyan-400">6</div>
                    <div className="text-white/60 text-sm">Years</div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-4">Our Values</h2>
                  <p className="text-white/70">The principles that guide everything we do</p>
                </div>
                <div className="space-y-4">
                  {values.map((value, index) => (
                    <div key={index} className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${value.color} flex items-center justify-center`}>
                          {value.icon}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-2">{value.title}</h3>
                          <p className="text-white/70">{value.description}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-white/40 mt-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-4">Meet Our Team</h2>
                  <p className="text-white/70">The talented people behind our success</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {teamMembers.map((member, index) => (
                    <div key={index} className="bg-white/5 rounded-2xl p-6 text-center border border-white/10 hover:bg-white/10 transition-all duration-300">
                      <div className="text-4xl mb-3">{member.image}</div>
                      <h3 className="text-lg font-semibold text-white mb-1">{member.name}</h3>
                      <p className="text-white/60 text-sm">{member.role}</p>
                      <div className="flex justify-center space-x-1 mt-3">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-4">Our Journey</h2>
                  <p className="text-white/70">Key milestones in our company's growth</p>
                </div>
                <div className="space-y-6">
                  {milestones.map((milestone, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {milestone.year}
                      </div>
                      <div className="bg-white/5 rounded-2xl p-4 flex-grow border border-white/10">
                        <h3 className="text-lg font-semibold text-white mb-1">{milestone.title}</h3>
                        <p className="text-white/70 text-sm">{milestone.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-center mt-8">
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center space-x-2 mx-auto">
                    <Play className="w-5 h-5" />
                    <span>Watch Our Story</span>
                  </button>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/10">
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className={`flex items-center space-x-2 px-6 py-3 rounded-2xl transition-all duration-300 ${
                  currentStep === 0 
                    ? 'text-white/30 cursor-not-allowed' 
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                onClick={() => setCurrentStep(Math.min(3, currentStep + 1))}
                disabled={currentStep === 3}
                className={`flex items-center space-x-2 px-6 py-3 rounded-2xl transition-all duration-300 ${
                  currentStep === 3 
                    ? 'bg-green-600 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <span>{currentStep === 3 ? 'Finish' : 'Next'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bottom Dots Indicator */}
      
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-12 w-4 h-4 bg-blue-400/60 rounded-full animate-pulse"></div>
      <div className="absolute top-1/3 right-20 w-2 h-2 bg-purple-400/60 rounded-full animate-bounce"></div>
      <div className="absolute bottom-1/4 left-20 w-3 h-3 bg-cyan-400/60 rounded-full animate-ping"></div>
      <div className="absolute bottom-1/3 right-12 w-2 h-2 bg-pink-400/60 rounded-full animate-pulse delay-150"></div>
      <Footer/>
    </div>
  );
}