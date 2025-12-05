// Smart contract configuration for "The Wall"
export const CONTRACT_ADDRESS = '0xc3A21E7d79b8ab27f7cf2325DeBcffB322fFD04f';

// Contract ABI - generated from the smart contract
export const CONTRACT_ABI = [
  // Events
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "postId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "author", "type": "address"},
      {"indexed": false, "internalType": "bytes32", "name": "contentHash", "type": "bytes32"},
      {"indexed": false, "internalType": "uint8", "name": "category", "type": "uint8"},
      {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"}
    ],
    "name": "PostCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "replyId", "type": "uint256"},
      {"indexed": true, "internalType": "uint256", "name": "postId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "author", "type": "address"},
      {"indexed": false, "internalType": "bytes32", "name": "contentHash", "type": "bytes32"},
      {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"}
    ],
    "name": "ReplyCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "targetId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "voter", "type": "address"},
      {"indexed": true, "internalType": "bool", "name": "isUpvote", "type": "bool"},
      {"indexed": false, "internalType": "uint256", "name": "weight", "type": "uint256"}
    ],
    "name": "VoteCast",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "postId", "type": "uint256"},
      {"indexed": false, "internalType": "uint8", "name": "newStatus", "type": "uint8"},
      {"indexed": false, "internalType": "address", "name": "moderator", "type": "address"}
    ],
    "name": "PostModerated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "user", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "newReputation", "type": "uint256"}
    ],
    "name": "ReputationUpdated",
    "type": "event"
  },

  // Read Functions
  {
    "inputs": [{"internalType": "uint256", "name": "postId", "type": "uint256"}],
    "name": "getPost",
    "outputs": [
      {
        "components": [
          {"internalType": "uint256", "name": "id", "type": "uint256"},
          {"internalType": "address", "name": "author", "type": "address"},
          {"internalType": "bytes32", "name": "contentHash", "type": "bytes32"},
          {"internalType": "uint8", "name": "category", "type": "uint8"},
          {"internalType": "uint256", "name": "timestamp", "type": "uint256"},
          {"internalType": "uint256", "name": "replyCount", "type": "uint256"},
          {"internalType": "uint256", "name": "upvotes", "type": "uint256"},
          {"internalType": "uint256", "name": "downvotes", "type": "uint256"},
          {"internalType": "uint8", "name": "status", "type": "uint8"},
          {"internalType": "uint256", "name": "parentId", "type": "uint256"},
          {"internalType": "uint256", "name": "reputation", "type": "uint256"},
          {"internalType": "bool", "name": "isAnonymous", "type": "bool"}
        ],
        "internalType": "struct TheWall.Post",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint8", "name": "category", "type": "uint8"},
      {"internalType": "uint256", "name": "offset", "type": "uint256"},
      {"internalType": "uint256", "name": "limit", "type": "uint256"}
    ],
    "name": "getPosts",
    "outputs": [
      {
        "components": [
          {"internalType": "uint256", "name": "id", "type": "uint256"},
          {"internalType": "address", "name": "author", "type": "address"},
          {"internalType": "bytes32", "name": "contentHash", "type": "bytes32"},
          {"internalType": "uint8", "name": "category", "type": "uint8"},
          {"internalType": "uint256", "name": "timestamp", "type": "uint256"},
          {"internalType": "uint256", "name": "replyCount", "type": "uint256"},
          {"internalType": "uint256", "name": "upvotes", "type": "uint256"},
          {"internalType": "uint256", "name": "downvotes", "type": "uint256"},
          {"internalType": "uint8", "name": "status", "type": "uint8"},
          {"internalType": "uint256", "name": "parentId", "type": "uint256"},
          {"internalType": "uint256", "name": "reputation", "type": "uint256"},
          {"internalType": "bool", "name": "isAnonymous", "type": "bool"}
        ],
        "internalType": "struct TheWall.Post[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "postId", "type": "uint256"},
      {"internalType": "uint256", "name": "offset", "type": "uint256"},
      {"internalType": "uint256", "name": "limit", "type": "uint256"}
    ],
    "name": "getReplies",
    "outputs": [
      {
        "components": [
          {"internalType": "uint256", "name": "id", "type": "uint256"},
          {"internalType": "uint256", "name": "postId", "type": "uint256"},
          {"internalType": "address", "name": "author", "type": "address"},
          {"internalType": "bytes32", "name": "contentHash", "type": "bytes32"},
          {"internalType": "uint256", "name": "timestamp", "type": "uint256"},
          {"internalType": "uint256", "name": "upvotes", "type": "uint256"},
          {"internalType": "uint256", "name": "downvotes", "type": "uint256"},
          {"internalType": "uint8", "name": "status", "type": "uint8"},
          {"internalType": "uint256", "name": "reputation", "type": "uint256"},
          {"internalType": "bool", "name": "isAnonymous", "type": "bool"}
        ],
        "internalType": "struct TheWall.Reply[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "getUserReputation",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "version",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "pure",
    "type": "function"
  },

  // State Variables
  {
    "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "name": "posts",
    "outputs": [
      {"internalType": "uint256", "name": "id", "type": "uint256"},
      {"internalType": "address", "name": "author", "type": "address"},
      {"internalType": "bytes32", "name": "contentHash", "type": "bytes32"},
      {"internalType": "uint8", "name": "category", "type": "uint8"},
      {"internalType": "uint256", "name": "timestamp", "type": "uint256"},
      {"internalType": "uint256", "name": "replyCount", "type": "uint256"},
      {"internalType": "uint256", "name": "upvotes", "type": "uint256"},
      {"internalType": "uint256", "name": "downvotes", "type": "uint256"},
      {"internalType": "uint8", "name": "status", "type": "uint8"},
      {"internalType": "uint256", "name": "parentId", "type": "uint256"},
      {"internalType": "uint256", "name": "reputation", "type": "uint256"},
      {"internalType": "bool", "name": "isAnonymous", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "postCount",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "replyCount",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "", "type": "address"}],
    "name": "userReputation",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },

  // Write Functions
  {
    "inputs": [
      {"internalType": "bytes32", "name": "contentHash", "type": "bytes32"},
      {"internalType": "uint8", "name": "category", "type": "uint8"},
      {"internalType": "bool", "name": "isAnonymous", "type": "bool"}
    ],
    "name": "createPost",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "postId", "type": "uint256"},
      {"internalType": "bytes32", "name": "contentHash", "type": "bytes32"},
      {"internalType": "bool", "name": "isAnonymous", "type": "bool"}
    ],
    "name": "createReply",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "postId", "type": "uint256"}],
    "name": "upvotePost",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "postId", "type": "uint256"}],
    "name": "downvotePost",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "replyId", "type": "uint256"}],
    "name": "upvoteReply",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "replyId", "type": "uint256"}],
    "name": "downvoteReply",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

// Enums
export const CATEGORIES = {
  0: 'General',
  1: 'Loneliness',
  2: 'Career',
  3: 'Anxiety',
  4: 'Relationships',
  5: 'Identity',
  6: 'Loss'
} as const;

export const POST_STATUSES = {
  0: 'Active',
  1: 'Hidden',
  2: 'Deleted',
  3: 'Pinned'
} as const;

// Reverse mappings for easy lookup
export const CATEGORY_IDS = {
  'General': 0,
  'Loneliness': 1,
  'Career': 2,
  'Anxiety': 3,
  'Relationships': 4,
  'Identity': 5,
  'Loss': 6
} as const;

export const STATUS_IDS = {
  'Active': 0,
  'Hidden': 1,
  'Deleted': 2,
  'Pinned': 3
} as const;

// Type definitions
export type Category = keyof typeof CATEGORIES;
export type PostStatus = keyof typeof POST_STATUSES;

export interface Post {
  id: string;
  author: string;
  contentHash: string;
  category: Category;
  timestamp: Date;
  replyCount: string;
  upvotes: string;
  downvotes: string;
  status: PostStatus;
  parentId: string;
  reputation: string;
  isAnonymous: boolean;
  content?: string; // Loaded from IPFS/database
}

export interface Reply {
  id: string;
  postId: string;
  author: string;
  contentHash: string;
  timestamp: Date;
  upvotes: string;
  downvotes: string;
  status: PostStatus;
  reputation: string;
  isAnonymous: boolean;
  content?: string; // Loaded from IPFS/database
}

// Network configuration
export const BASE_SEPOLIA_CHAIN = {
  id: 84532,
  name: 'Base Sepolia',
  network: 'base-sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: ['https://sepolia.base.org'] },
    public: { http: ['https://sepolia.base.org'] },
  },
  blockExplorers: {
    default: { name: 'BaseScan', url: 'https://sepolia.basescan.org' },
  },
  testnet: true,
} as const;