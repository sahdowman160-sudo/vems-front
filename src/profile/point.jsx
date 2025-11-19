import React, { useState, useEffect } from 'react';
import { Award, Gift, X, Sparkles, TrendingUp } from 'lucide-react';

export default function UserPointsPage() {
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [claimLoading, setClaimLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUserPoints();
  }, []);
const fetchUserPoints = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('No authentication token found');
      setLoading(false);
      return;
    }

    const response = await fetch('http://127.0.0.1:8000/points', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // ✅ required
      },
      body: JSON.stringify({ token }), // ✅ send as JSON
    });

    if (response.ok) {
      const data = await response.json();
      setPoints(data[0].points || 0);
    } else {
      console.error('Failed to fetch points:', response.status);
      setMessage('Failed to fetch points');
    }
  } catch (error) {
    console.error('Error fetching points:', error);
    setMessage('Error fetching points');
  } finally {
    setLoading(false);
  }
};



  const handleClaimReward = async (rewardType) => {
    setClaimLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('No authentication token found');
        setClaimLoading(false);
        return;
      }

      const response = await fetch('YOUR_API_ENDPOINT/claim-reward', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: token,
          reward_type: rewardType
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(`Success! ${rewardType === 'discount' ? '30% discount' : 'Free shipping'} claimed!`);
        setPoints(prev => prev - 100);
        setTimeout(() => {
          setShowRewardModal(false);
          setMessage('');
        }, 2000);
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.message || 'Failed to claim reward'}`);
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
      console.error('Error:', error);
    } finally {
      setClaimLoading(false);
    }
  };

  const openRewardModal = (reward) => {
    setSelectedReward(reward);
    setShowRewardModal(true);
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-l from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent transform rotate-12 animate-pulse"></div>
        <div className="absolute bottom-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent transform -rotate-12 animate-pulse"></div>
      </div>

      {/* Header */}
      <header className="relative z-20 border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <Award className="text-white w-4 h-4 md:w-5 md:h-5" />
            </div>
            <div>
              <h1 className="text-white font-bold text-base md:text-xl">Rewards Center</h1>
              <p className="text-white/50 text-xs hidden sm:block">Your Points Dashboard</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 p-4 md:p-6 max-w-4xl mx-auto">
        {/* Welcome Banner */}
        <div className="mb-6 p-6 rounded-2xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Your Rewards</h2>
              <p className="text-white/60">Earn points and unlock exclusive rewards</p>
            </div>
            <Sparkles className="w-12 h-12 text-orange-400 animate-pulse" />
          </div>
        </div>

        {/* Points Display - Main Card */}
        <div className="mb-6 p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-red-500 mb-4 group-hover:scale-110 transition-transform duration-300">
              <Award className="w-10 h-10 text-white" />
            </div>
            <p className="text-white/60 text-sm mb-2">Total Points</p>
            <p className="text-6xl font-bold text-white mb-2">
              {loading ? '...' : points}
            </p>
            <div className="flex items-center justify-center gap-2 text-green-400 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>Keep earning!</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-white/60 mb-2">
              <span>Progress to reward</span>
              <span>{points}/100</span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((points / 100) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Claim Reward Button - Shows when points >= 100 */}
        {points >= 100 && (
          <div className="mb-6 p-6 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 backdrop-blur-sm animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Gift className="w-12 h-12 text-green-400" />
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Reward Available!</h3>
                  <p className="text-white/80">You've earned enough points to claim a reward</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rewards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 30% Discount Card */}
          <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <span className="text-white font-bold text-xl">30%</span>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                100 pts
              </span>
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Discount Coupon</h4>
            <p className="text-white/60 text-sm mb-4">Get 30% off your next purchase</p>
            <button
              onClick={() => openRewardModal('discount')}
              disabled={points < 100}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                points >= 100
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600'
                  : 'bg-white/5 text-white/40 cursor-not-allowed border border-white/10'
              }`}
            >
              {points >= 100 ? 'Claim Reward' : 'Need more points'}
            </button>
          </div>

          {/* Free Shipping Card */}
          <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <Gift className="text-white w-6 h-6" />
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                100 pts
              </span>
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Free Shipping</h4>
            <p className="text-white/60 text-sm mb-4">Get free shipping on any order</p>
            <button
              onClick={() => openRewardModal('shipping')}
              disabled={points < 100}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                points >= 100
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
                  : 'bg-white/5 text-white/40 cursor-not-allowed border border-white/10'
              }`}
            >
              {points >= 100 ? 'Claim Reward' : 'Need more points'}
            </button>
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-6 p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-white mb-3">How to earn points?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-white/60">
              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
              <span>bay a Proudct: +10 points</span>
            </div>
          </div>
        </div>
      </main>

      {/* Reward Modal */}
      {showRewardModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-black/90 border border-white/20 rounded-2xl p-8 max-w-md w-full backdrop-blur-xl relative">
            <button
              onClick={() => setShowRewardModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-red-500 mb-4">
                <Gift className="w-10 h-10 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2">
                {selectedReward === 'discount' ? '30% Discount' : 'Free Shipping'}
              </h3>
              <p className="text-white/60 mb-6">
                {selectedReward === 'discount' 
                  ? 'Use this coupon on your next purchase to get 30% off'
                  : 'Get free shipping on any order, no minimum required'}
              </p>

              <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-white/60 text-sm mb-1">Cost</p>
                <p className="text-3xl font-bold text-white">100 Points</p>
              </div>

              {message && (
                <div className={`mb-4 p-3 rounded-lg ${
                  message.includes('Success') 
                    ? 'bg-green-500/20 border border-green-500/30 text-green-400' 
                    : 'bg-red-500/20 border border-red-500/30 text-red-400'
                }`}>
                  {message}
                </div>
              )}

              <button
                onClick={() => handleClaimReward(selectedReward)}
                disabled={claimLoading}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {claimLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Claiming...
                  </>
                ) : (
                  <>
                    <Gift className="w-5 h-5" />
                    Claim Reward
                  </>
                )}
              </button>

              <button
                onClick={() => setShowRewardModal(false)}
                className="w-full mt-3 text-white/60 hover:text-white py-2 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}