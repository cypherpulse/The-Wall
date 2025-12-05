// Smart Contract Integration for "The Wall"
// Base Sepolia Testnet Contract: 0xc3A21E7d79b8ab27f7cf2325DeBcffB322fFD04f

import { ethers } from 'ethers'
import { useAppKitProvider } from '@reown/appkit/react'
import { useCallback, useEffect, useState } from 'react'

// Contract Configuration
export const CONTRACT_ADDRESS = '0xc3A21E7d79b8ab27f7cf2325DeBcffB322fFD04f'

export const CONTRACT_ABI = [
  // Events
  "event PostCreated(uint256 indexed postId, address indexed author, bytes32 contentHash, uint8 category, uint256 timestamp)",
  "event ReplyCreated(uint256 indexed replyId, uint256 indexed postId, address indexed author, bytes32 contentHash, uint256 timestamp)",
  "event VoteCast(uint256 indexed targetId, address indexed voter, bool indexed isUpvote, uint256 weight)",
  "event PostModerated(uint256 indexed postId, uint8 newStatus, address moderator)",
  "event ReputationUpdated(address indexed user, uint256 newReputation)",

  // Read Functions
  "function getPost(uint256 postId) view returns (tuple(uint256 id, address author, bytes32 contentHash, uint8 category, uint256 timestamp, uint256 replyCount, uint256 upvotes, uint256 downvotes, uint8 status, uint256 parentId, uint256 reputation, bool isAnonymous))",
  "function getPosts(uint8 category, uint256 offset, uint256 limit) view returns (tuple(uint256 id, address author, bytes32 contentHash, uint8 category, uint256 timestamp, uint256 replyCount, uint256 upvotes, uint256 downvotes, uint8 status, uint256 parentId, uint256 reputation, bool isAnonymous)[])",
  "function getReplies(uint256 postId, uint256 offset, uint256 limit) view returns (tuple(uint256 id, uint256 postId, address author, bytes32 contentHash, uint256 timestamp, uint256 upvotes, uint256 downvotes, uint8 status, uint256 reputation, bool isAnonymous)[])",
  "function getUserReputation(address user) view returns (uint256)",
  "function version() pure returns (string)",

  // State Variables
  "function posts(uint256) view returns (uint256 id, address author, bytes32 contentHash, uint8 category, uint256 timestamp, uint256 replyCount, uint256 upvotes, uint256 downvotes, uint8 status, uint256 parentId, uint256 reputation, bool isAnonymous)",
  "function postCount() view returns (uint256)",
  "function replyCount() view returns (uint256)",
  "function userReputation(address) view returns (uint256)",

  // Write Functions
  "function createPost(bytes32 contentHash, uint8 category, bool isAnonymous) returns (uint256)",
  "function createReply(uint256 postId, bytes32 contentHash, bool isAnonymous) returns (uint256)",
  "function upvotePost(uint256 postId)",
  "function downvotePost(uint256 postId)",
  "function upvoteReply(uint256 replyId)",
  "function downvoteReply(uint256 replyId)"
]

// Enums and Constants
export const CATEGORIES = {
  0: 'General',
  1: 'Loneliness',
  2: 'Career',
  3: 'Anxiety',
  4: 'Relationships',
  5: 'Identity',
  6: 'Loss',
  General: 0,
  Loneliness: 1,
  Career: 2,
  Anxiety: 3,
  Relationships: 4,
  Identity: 5,
  Loss: 6
} as const

export const POST_STATUSES = {
  0: 'Active',
  1: 'Hidden',
  2: 'Deleted',
  3: 'Pinned'
} as const

// Types
export interface OnChainPost {
  id: string
  author: string
  contentHash: string
  category: keyof typeof CATEGORIES
  timestamp: Date
  replyCount: string
  upvotes: string
  downvotes: string
  status: keyof typeof POST_STATUSES
  parentId: string
  reputation: string
  isAnonymous: boolean
  content?: string // Will be loaded separately
}

export interface OnChainReply {
  id: string
  postId: string
  author: string
  contentHash: string
  timestamp: Date
  upvotes: string
  downvotes: string
  status: keyof typeof POST_STATUSES
  reputation: string
  isAnonymous: boolean
  content?: string
}

// Content Storage (Simple localStorage for now - replace with IPFS in production)
class ContentStorage {
  private static instance: ContentStorage
  private cache: Map<string, string> = new Map()

  static getInstance(): ContentStorage {
    if (!ContentStorage.instance) {
      ContentStorage.instance = new ContentStorage()
    }
    return ContentStorage.instance
  }

  async store(content: string): Promise<string> {
    const hash = ethers.keccak256(ethers.toUtf8Bytes(content))
    localStorage.setItem(`content_${hash}`, content)
    this.cache.set(hash, content)
    return hash
  }

  async retrieve(hash: string): Promise<string | null> {
    if (this.cache.has(hash)) {
      return this.cache.get(hash)!
    }

    const content = localStorage.getItem(`content_${hash}`)
    if (content) {
      this.cache.set(hash, content)
      return content
    }

    return null
  }
}

export const contentStorage = ContentStorage.getInstance()

// Smart Contract Service Class
export class TheWallContract {
  private contract: ethers.Contract | null = null
  private readOnlyContract: ethers.Contract | null = null
  private provider: ethers.BrowserProvider | null = null
  private signer: ethers.JsonRpcSigner | null = null

  async initialize(walletProvider?: any) {
    if (walletProvider) {
      this.provider = new ethers.BrowserProvider(walletProvider)
      this.signer = await this.provider.getSigner()
      this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.signer)
    }

    // Always create read-only contract for view functions
    if (!this.readOnlyContract) {
      const rpcProvider = new ethers.JsonRpcProvider('https://sepolia.base.org')
      this.readOnlyContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, rpcProvider)
    }
  }

  private getContract(): ethers.Contract {
    if (!this.contract) {
      throw new Error('Contract not initialized. Please connect wallet first.')
    }
    return this.contract
  }

  private getReadOnlyContract(): ethers.Contract {
    if (!this.readOnlyContract) {
      throw new Error('Read-only contract not initialized.')
    }
    return this.readOnlyContract
  }

  // Utility Functions
  hashContent(content: string): string {
    return ethers.keccak256(ethers.toUtf8Bytes(content))
  }

  formatPost(rawPost: any): OnChainPost {
    return {
      id: rawPost.id.toString(),
      author: rawPost.author,
      contentHash: rawPost.contentHash,
      category: rawPost.category,
      timestamp: new Date(Number(rawPost.timestamp) * 1000),
      replyCount: rawPost.replyCount.toString(),
      upvotes: rawPost.upvotes.toString(),
      downvotes: rawPost.downvotes.toString(),
      status: rawPost.status,
      parentId: rawPost.parentId.toString(),
      reputation: rawPost.reputation.toString(),
      isAnonymous: rawPost.isAnonymous
    }
  }

  formatReply(rawReply: any): OnChainReply {
    return {
      id: rawReply.id.toString(),
      postId: rawReply.postId.toString(),
      author: rawReply.author,
      contentHash: rawReply.contentHash,
      timestamp: new Date(Number(rawReply.timestamp) * 1000),
      upvotes: rawReply.upvotes.toString(),
      downvotes: rawReply.downvotes.toString(),
      status: rawReply.status,
      reputation: rawReply.reputation.toString(),
      isAnonymous: rawReply.isAnonymous
    }
  }

  // Read Functions
  async getPost(postId: string): Promise<OnChainPost | null> {
    try {
      const contract = this.getReadOnlyContract()
      const post = await contract.getPost(postId)
      const formattedPost = this.formatPost(post)

      // Load content
      const content = await contentStorage.retrieve(formattedPost.contentHash)
      formattedPost.content = content || 'Content not available'

      return formattedPost
    } catch (error) {
      console.error('Error fetching post:', error)
      return null
    }
  }

  async getPosts(category: number, offset = 0, limit = 20): Promise<OnChainPost[]> {
    try {
      const contract = this.getReadOnlyContract()
      const posts = await contract.getPosts(category, offset, limit)

      const formattedPosts = await Promise.all(
        posts.map(async (post: any) => {
          const formattedPost = this.formatPost(post)
          const content = await contentStorage.retrieve(formattedPost.contentHash)
          formattedPost.content = content || 'Content not available'
          return formattedPost
        })
      )

      return formattedPosts
    } catch (error) {
      console.error('Error fetching posts:', error)
      return []
    }
  }

  async getAllPosts(limit = 50): Promise<OnChainPost[]> {
    const allPosts: OnChainPost[] = []

    // Fetch from all categories
    for (let category = 0; category <= 6; category++) {
      try {
        const categoryPosts = await this.getPosts(category, 0, limit)
        allPosts.push(...categoryPosts)
      } catch (error) {
        console.warn(`Error fetching category ${category}:`, error)
      }
    }

    // Sort by timestamp (newest first)
    return allPosts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  async getReplies(postId: string, offset = 0, limit = 50): Promise<OnChainReply[]> {
    try {
      const contract = this.getReadOnlyContract()
      const replies = await contract.getReplies(postId, offset, limit)

      const formattedReplies = await Promise.all(
        replies.map(async (reply: any) => {
          const formattedReply = this.formatReply(reply)
          const content = await contentStorage.retrieve(formattedReply.contentHash)
          formattedReply.content = content || 'Content not available'
          return formattedReply
        })
      )

      return formattedReplies
    } catch (error) {
      console.error('Error fetching replies:', error)
      return []
    }
  }

  async getUserReputation(address: string): Promise<string> {
    try {
      const contract = this.getReadOnlyContract()
      const reputation = await contract.getUserReputation(address)
      return reputation.toString()
    } catch (error) {
      console.error('Error fetching reputation:', error)
      return '0'
    }
  }

  // Write Functions
  async createPost(content: string, category: number, isAnonymous = false): Promise<{ postId: string; transactionHash: string }> {
    try {
      const contract = this.getContract()
      const contentHash = this.hashContent(content)

      // Store content locally first
      await contentStorage.store(content)

      // Estimate gas
      const gasEstimate = await contract.createPost.estimateGas(contentHash, category, isAnonymous)

      // Send transaction
      const tx = await contract.createPost(contentHash, category, isAnonymous, {
        gasLimit: Math.ceil(Number(gasEstimate) * 1.2)
      })

      // Wait for confirmation
      const receipt = await tx.wait()

      // Extract post ID from events
      const postCreatedEvent = receipt.logs.find((log: any) => {
        try {
          return contract.interface.parseLog(log)?.name === 'PostCreated'
        } catch {
          return false
        }
      })

      if (postCreatedEvent) {
        const parsedLog = contract.interface.parseLog(postCreatedEvent)
        return {
          postId: parsedLog?.args.postId.toString(),
          transactionHash: receipt.hash
        }
      }

      throw new Error('Post creation event not found')

    } catch (error: any) {
      this.handleError(error)
      throw error
    }
  }

  async createReply(postId: string, content: string, isAnonymous = false): Promise<{ replyId: string; transactionHash: string }> {
    try {
      const contract = this.getContract()
      const contentHash = this.hashContent(content)

      // Store content locally first
      await contentStorage.store(content)

      const gasEstimate = await contract.createReply.estimateGas(postId, contentHash, isAnonymous)

      const tx = await contract.createReply(postId, contentHash, isAnonymous, {
        gasLimit: Math.ceil(Number(gasEstimate) * 1.2)
      })

      const receipt = await tx.wait()

      const replyCreatedEvent = receipt.logs.find((log: any) => {
        try {
          return contract.interface.parseLog(log)?.name === 'ReplyCreated'
        } catch {
          return false
        }
      })

      if (replyCreatedEvent) {
        const parsedLog = contract.interface.parseLog(replyCreatedEvent)
        return {
          replyId: parsedLog?.args.replyId.toString(),
          transactionHash: receipt.hash
        }
      }

      throw new Error('Reply creation event not found')

    } catch (error: any) {
      this.handleError(error)
      throw error
    }
  }

  async voteOnPost(postId: string, isUpvote: boolean): Promise<void> {
    try {
      const contract = this.getContract()
      const gasEstimate = await contract[isUpvote ? 'upvotePost' : 'downvotePost'].estimateGas(postId)

      const tx = await contract[isUpvote ? 'upvotePost' : 'downvotePost'](postId, {
        gasLimit: Math.ceil(Number(gasEstimate) * 1.2)
      })

      await tx.wait()

    } catch (error: any) {
      this.handleError(error)
      throw error
    }
  }

  async voteOnReply(replyId: string, isUpvote: boolean): Promise<void> {
    try {
      const contract = this.getContract()
      const gasEstimate = await contract[isUpvote ? 'upvoteReply' : 'downvoteReply'].estimateGas(replyId)

      const tx = await contract[isUpvote ? 'upvoteReply' : 'downvoteReply'](replyId, {
        gasLimit: Math.ceil(Number(gasEstimate) * 1.2)
      })

      await tx.wait()

    } catch (error: any) {
      this.handleError(error)
      throw error
    }
  }

  private handleError(error: any): void {
    const errorMessages: { [key: string]: string } = {
      'InsufficientReputation': 'You need at least 1 reputation point to post/reply',
      'AlreadyVoted': 'You have already voted on this content',
      'PostNotFound': 'The post you\'re looking for doesn\'t exist',
      'ReplyNotFound': 'The reply you\'re looking for doesn\'t exist',
      'InvalidContent': 'Content is duplicate or invalid',
      'NotAuthorized': 'You don\'t have permission for this action',
      'ContractPaused': 'The contract is currently paused'
    }

    for (const [key, message] of Object.entries(errorMessages)) {
      if (error.message?.includes(key)) {
        throw new Error(message)
      }
    }

    if (error.code === 4001) {
      throw new Error('Transaction was cancelled by user.')
    }

    throw error
  }

  // Event Listeners
  onPostCreated(callback: (post: { postId: string; author: string; contentHash: string; category: number; timestamp: Date }) => void) {
    const contract = this.getReadOnlyContract()
    contract.on('PostCreated', (postId, author, contentHash, category, timestamp) => {
      callback({
        postId: postId.toString(),
        author,
        contentHash,
        category: Number(category),
        timestamp: new Date(Number(timestamp) * 1000)
      })
    })
  }

  onReplyCreated(callback: (reply: { replyId: string; postId: string; author: string; contentHash: string; timestamp: Date }) => void) {
    const contract = this.getReadOnlyContract()
    contract.on('ReplyCreated', (replyId, postId, author, contentHash, timestamp) => {
      callback({
        replyId: replyId.toString(),
        postId: postId.toString(),
        author,
        contentHash,
        timestamp: new Date(Number(timestamp) * 1000)
      })
    })
  }

  onVoteCast(callback: (vote: { targetId: string; voter: string; isUpvote: boolean; weight: string }) => void) {
    const contract = this.getReadOnlyContract()
    contract.on('VoteCast', (targetId, voter, isUpvote, weight) => {
      callback({
        targetId: targetId.toString(),
        voter,
        isUpvote,
        weight: weight.toString()
      })
    })
  }
}

// Singleton instance
export const theWallContract = new TheWallContract()

// React Hooks
export function useTheWallContract() {
  const { walletProvider } = useAppKitProvider()
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (walletProvider) {
      theWallContract.initialize(walletProvider).then(() => {
        setIsInitialized(true)
      })
    } else {
      // Initialize read-only contract even without wallet
      theWallContract.initialize().then(() => {
        setIsInitialized(true)
      })
    }
  }, [walletProvider])

  return { contract: theWallContract, isInitialized }
}

export function usePosts(category?: number, limit = 20) {
  const [posts, setPosts] = useState<OnChainPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { contract, isInitialized } = useTheWallContract()

  const fetchPosts = useCallback(async () => {
    if (!isInitialized) return

    try {
      setLoading(true)
      setError(null)

      let fetchedPosts: OnChainPost[]
      if (category !== undefined) {
        fetchedPosts = await contract.getPosts(category, 0, limit)
      } else {
        fetchedPosts = await contract.getAllPosts(limit)
      }

      setPosts(fetchedPosts)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [contract, isInitialized, category, limit])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  // Listen for new posts
  useEffect(() => {
    if (!isInitialized) return

    const handleNewPost = () => {
      fetchPosts() // Refresh posts when new one is created
    }

    contract.onPostCreated(handleNewPost)

    return () => {
      // Note: In a real app, you'd want to properly clean up listeners
    }
  }, [contract, isInitialized, fetchPosts])

  return { posts, loading, error, refetch: fetchPosts }
}

export function usePost(postId: string) {
  const [post, setPost] = useState<OnChainPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { contract, isInitialized } = useTheWallContract()

  useEffect(() => {
    if (!isInitialized || !postId) return

    const fetchPost = async () => {
      try {
        setLoading(true)
        setError(null)
        const fetchedPost = await contract.getPost(postId)
        setPost(fetchedPost)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [contract, isInitialized, postId])

  return { post, loading, error }
}

export function useReplies(postId: string) {
  const [replies, setReplies] = useState<OnChainReply[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { contract, isInitialized } = useTheWallContract()

  useEffect(() => {
    if (!isInitialized || !postId) return

    const fetchReplies = async () => {
      try {
        setLoading(true)
        setError(null)
        const fetchedReplies = await contract.getReplies(postId)
        setReplies(fetchedReplies)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchReplies()
  }, [contract, isInitialized, postId])

  return { replies, loading, error }
}

export function useUserReputation(address?: string) {
  const [reputation, setReputation] = useState('0')
  const [loading, setLoading] = useState(true)
  const { contract, isInitialized } = useTheWallContract()

  useEffect(() => {
    if (!isInitialized || !address) return

    const fetchReputation = async () => {
      try {
        setLoading(true)
        const rep = await contract.getUserReputation(address)
        setReputation(rep)
      } catch (err: any) {
        console.error('Error fetching reputation:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchReputation()
  }, [contract, isInitialized, address])

  return { reputation, loading }
}