import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';
import { getThreadById, getRepliesByThread, createReply } from '../services/forumService';
import { useUser } from '@/context/UserContext';

// Este comentario se añade para asegurar que Vite compile el archivo de nuevo.

const ThreadPage = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [thread, setThread] = useState(null);
  const [replies, setReplies] = useState([]);
  const [replyContent, setReplyContent] = useState("");
  const { user } = useUser();
  const user_id = user?.auth?.id;
  const username = user?.nombre || user?.auth?.email;

  useEffect(() => {
    getThreadById(id).then(setThread);
    getRepliesByThread(id).then(setReplies);
  }, [id]);

  if (!thread) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <h1 className="text-4xl font-bold text-red-500">{t('thread.not_found')}</h1>
      </div>
    );
  }

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    const newReply = await createReply({ thread_id: id, content: replyContent, user_id, username });
    setReplies([...replies, newReply]);
    setReplyContent("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-black text-white py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-3xl mx-auto">
        {/* Thread Title Section */}
        <Card className="bg-gray-900 border-gray-800 mb-6">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-red-500 mb-2">{thread.title}</CardTitle>
            <p className="text-sm text-gray-400">
              {t('thread.by')} <span className="font-medium text-red-400">{thread.username}</span> - {new Date(thread.created_at).toLocaleString()}
            </p>
          </CardHeader>
        </Card>

        {/* Initial Post */}
        <Card className="bg-gray-900 border-gray-800 mb-6">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Avatar className="h-10 w-10 mr-4">
                <AvatarImage src={"https://github.com/shadcn.png"} alt={thread.username} />
                <AvatarFallback>{thread.username?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-white">{thread.username}</p>
                <p className="text-xs text-gray-500">{new Date(thread.created_at).toLocaleString()}</p>
              </div>
            </div>
            <div className="whitespace-pre-line text-lg text-white">{thread.content}</div>
          </CardContent>
        </Card>

        {/* Replies */}
        <h2 className="text-2xl font-bold text-red-400 mb-4">
          {t('thread.replies', { count: replies.length })}
        </h2>
        <Card className="bg-black/60 border-gray-800 shadow-lg backdrop-blur-sm mb-6">
          <CardContent className="p-0">
            <ul className="divide-y divide-gray-800">
              {replies.length > 0 ? (
                replies.map(reply => (
                  <li key={reply.id} className="p-4">
                    <Card className="bg-gray-900 border-gray-800 mb-2">
                      <CardContent className="flex items-start gap-4 p-4">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={"https://github.com/shadcn.png"} alt={reply.username} />
                          <AvatarFallback>{reply.username?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-white">{reply.username}</p>
                          <p className="text-xs text-gray-500">{new Date(reply.created_at).toLocaleString()}</p>
                          <div className="whitespace-pre-line text-white mt-1">{reply.content}</div>
                        </div>
                      </CardContent>
                    </Card>
                  </li>
                ))
              ) : (
                <li className="p-4 text-center text-gray-500">{t('thread.no_replies')}</li>
              )}
            </ul>
          </CardContent>
        </Card>

        {/* Reply Box */}
        <form onSubmit={handleReply} className="mb-8">
          <Textarea
            value={replyContent}
            onChange={e => setReplyContent(e.target.value)}
            placeholder={t('thread.reply_placeholder')}
            className="mb-2 bg-gray-900 border-gray-700 text-white"
            rows={3}
            required
            disabled={!user}
          />
          <Button type="submit" className="bg-red-600 hover:bg-red-700" disabled={!user}>
            {t('thread.reply_button')}
          </Button>
        </form>
      </div>
    </motion.div>
  );
};

export default ThreadPage; 