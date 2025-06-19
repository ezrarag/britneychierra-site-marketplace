"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, Share, Send } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

const communityPosts = [
  {
    id: 1,
    user: {
      name: "SARAH M.",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "Just recreated Britney's pink paradise look and I'm OBSESSED! The confidence boost is real!",
    image: "/placeholder.svg?height=300&width=400",
    likes: 45,
    comments: 12,
    timeAgo: "2H AGO",
  },
  {
    id: 2,
    user: {
      name: "MAYA K.",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: 'Britney\'s new track "Neon Dreams" has been on repeat all week! The vibes are immaculate.',
    likes: 67,
    comments: 23,
    timeAgo: "4H AGO",
  },
  {
    id: 3,
    user: {
      name: "ALEX R.",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content:
      "Hosting a virtual styling session this weekend! Who wants to join and recreate some of our fave looks together?",
    image: "/placeholder.svg?height=300&width=400",
    likes: 89,
    comments: 34,
    timeAgo: "6H AGO",
  },
]

export default function CommunityPage() {
  const [newPost, setNewPost] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitPost = async () => {
    if (!newPost.trim()) return

    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast.success("Your post has been shared with the community!")
    setNewPost("")
    setIsSubmitting(false)
  }

  const handleLike = (postId: number) => {
    toast.success("Liked!")
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
            <h1 className="text-[6vw] md:text-[8vw] lg:text-[10vw] font-black leading-[0.8] tracking-tighter mb-8">
              <span className="text-white">COMMUNITY</span>
              <br />
              <span className="text-gray-500">SPACE.</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mb-12 leading-relaxed">
              Where style meets soul. Share your looks, connect with like-minded people, and celebrate our unique
              journeys.
            </p>
          </motion.div>

          {/* Create Post */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <Card className="bg-transparent border-white/10">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" />
                    <AvatarFallback>YOU</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-white font-bold tracking-wider">SHARE WITH THE COMMUNITY</div>
                    <div className="text-gray-400">What's inspiring you today?</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <Textarea
                  placeholder="Share your style journey, recreations, or just say hi!"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="bg-transparent border-white/20 text-white placeholder:text-gray-500 min-h-[120px] text-lg"
                />
                <div className="flex justify-end">
                  <Button
                    onClick={handleSubmitPost}
                    disabled={!newPost.trim() || isSubmitting}
                    className="bg-white text-black hover:bg-gray-200 px-8 py-3 font-bold"
                  >
                    {isSubmitting ? "POSTING..." : "SHARE"}
                    <Send className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Community Feed */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-8"
          >
            {communityPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-transparent border-white/10 hover:border-white/20 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={post.user.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{post.user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-white font-bold tracking-wider">{post.user.name}</div>
                          <div className="text-gray-400 text-sm">{post.timeAgo}</div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <p className="text-white text-lg leading-relaxed">{post.content}</p>

                    {post.image && (
                      <Image
                        src={post.image || "/placeholder.svg"}
                        alt="Community post"
                        width={400}
                        height={300}
                        className="w-full rounded"
                      />
                    )}

                    <div className="flex items-center justify-between pt-6 border-t border-white/10">
                      <div className="flex items-center gap-8">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(post.id)}
                          className="text-gray-400 hover:text-white p-0 font-bold tracking-wider"
                        >
                          <Heart className="w-5 h-5 mr-2" />
                          {post.likes}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-white p-0 font-bold tracking-wider"
                        >
                          <MessageCircle className="w-5 h-5 mr-2" />
                          {post.comments}
                        </Button>
                      </div>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-0">
                        <Share className="w-5 h-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
