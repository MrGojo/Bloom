import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '../components/BottomNav';
import { getMessages, createMessage, deleteMessage } from '../utils/api';
import { toast } from 'sonner';

export default function AdminPanel() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchMessages();
  }, []);
  
  const fetchMessages = async () => {
    try {
      const data = await getMessages();
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddMessage = async () => {
    if (!newMessage.trim()) {
      toast.error('Please enter a message');
      return;
    }
    
    try {
      await createMessage({ message: newMessage });
      toast.success('Message added! 💕');
      setNewMessage('');
      fetchMessages();
    } catch (error) {
      toast.error('Failed to add message');
    }
  };
  
  const handleDeleteMessage = async (messageId) => {
    try {
      await deleteMessage(messageId);
      toast.success('Message deleted');
      fetchMessages();
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-pcos-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-pcos-primary border-t-transparent"></div>
      </div>
    );
  }
  
  return (
    <div data-testid="admin-panel-page" className="min-h-screen bg-pcos-background pb-24">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-pcos-background/95 backdrop-blur-lg border-b border-pcos-border p-6">
          <div className="flex items-center justify-between">
            <button
              data-testid="back-button"
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-pcos-card"
            >
              <ArrowLeft className="w-5 h-5 text-pcos-text" />
            </button>
            <h1 className="text-2xl font-heading font-bold text-pcos-text">Boyfriend Panel</h1>
            <div className="w-10"></div>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Info Card */}
          <div className="bg-gradient-to-r from-pcos-primary to-pcos-secondary rounded-pcos-xl p-6 text-white">
            <h2 className="text-xl font-heading font-bold mb-2">Hey there! 💕</h2>
            <p className="font-body leading-relaxed opacity-90">
              Add personalized messages for Grishu. These will rotate daily along with the default motivational messages. 
              Make them sweet, supportive, and full of love!
            </p>
          </div>
          
          {/* Add Message Form */}
          <div className="bg-white rounded-pcos-xl p-6 shadow-pcos-card space-y-4">
            <h3 className="font-heading font-bold text-lg text-pcos-text">Add New Message</h3>
            <textarea
              data-testid="message-input"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Write a loving message for Grishu..."
              rows={4}
              className="w-full px-4 py-3 rounded-2xl border-2 border-pcos-border focus:border-pcos-primary outline-none font-body text-pcos-text resize-none"
            />
            <motion.button
              data-testid="add-message-button"
              whileTap={{ scale: 0.98 }}
              onClick={handleAddMessage}
              className="w-full py-3 rounded-full bg-gradient-to-r from-pcos-primary to-pcos-secondary text-white font-body font-medium shadow-pcos-button flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Message</span>
            </motion.button>
          </div>
          
          {/* Messages List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="font-heading font-bold text-lg text-pcos-text">Your Messages</h3>
              <span className="text-sm font-body text-pcos-text-muted">{messages.filter(m => m.is_custom).length} custom</span>
            </div>
            
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">💌</div>
                <p className="text-pcos-text-muted font-body">
                  No messages yet. Add your first message!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.message_id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-2xl p-5 shadow-pcos-card ${
                      msg.is_custom ? 'bg-white' : 'bg-pcos-secondary/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <p className="font-body text-pcos-text leading-relaxed">
                          {msg.message}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className={`text-xs font-body px-2 py-1 rounded-full ${
                            msg.is_custom 
                              ? 'bg-pcos-primary/10 text-pcos-primary' 
                              : 'bg-pcos-secondary text-pcos-text-muted'
                          }`}>
                            {msg.is_custom ? 'Custom' : 'Default'}
                          </span>
                        </div>
                      </div>
                      {msg.is_custom && (
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDeleteMessage(msg.message_id)}
                          className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 hover:bg-red-600 text-red-600 hover:text-white transition-colors flex items-center justify-center"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
          
          {/* Tips Card */}
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-pcos-xl p-6">
            <h3 className="font-heading font-bold text-lg text-pcos-text mb-3 flex items-center gap-2">
              <span>💡</span> Message Tips
            </h3>
            <ul className="space-y-2 text-sm font-body text-pcos-text-muted">
              <li>• Keep them personal and heartfelt</li>
              <li>• Be supportive and encouraging</li>
              <li>• Avoid being judgmental or pushy</li>
              <li>• Express your love and pride</li>
              <li>• Remind her she's healing every day</li>
            </ul>
          </div>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
}