// Contribution #63: "^1.8.14", - Code review system
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";

export default function About() {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-black mb-6 glow-text text-center">
          About The Wall
        </h1>

        <div className="space-y-6">
          <Card className="p-8 glow-border">
            <h2 className="text-2xl font-bold mb-4 text-primary">What is The Wall?</h2>
            <p className="text-foreground leading-relaxed">
              The Wall is a decentralized therapy-style platform where thoughts become permanent. 
              Every post, every reply lives forever on the blockchainâ€”anonymous yet immutable. 
              No profiles. No DMs. No judgments. Just raw, honest expressions in the digital void.
            </p>
          </Card>

          <Card className="p-8 glow-border">
            <h2 className="text-2xl font-bold mb-4 text-primary">Why Blockchain?</h2>
            <p className="text-foreground leading-relaxed">
              Traditional platforms can delete, censor, or manipulate content. On The Wall, 
              every thought is cryptographically secured and distributed across the network. 
              Your words can't be erased. Your voice can't be silenced. The truth persists.
            </p>
          </Card>

          <Card className="p-8 glow-border">
            <h2 className="text-2xl font-bold mb-4 text-primary">How It Works</h2>
            <ul className="space-y-3 text-foreground">
              <li className="flex items-start">
                <span className="text-primary mr-2">â†’</span>
                <span>Connect your wallet (coming soon) or post directly</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">â†’</span>
                <span>Share your thoughts anonymously with an auto-generated username</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">â†’</span>
                <span>Each post is written to the blockchain with cryptographic proof</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">â†’</span>
                <span>Reply to others, build connections through shared experiences</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">â†’</span>
                <span>Everything stays foreverâ€”immutable and transparent</span>
              </li>
            </ul>
          </Card>

          <Card className="p-8 glow-border">
            <h2 className="text-2xl font-bold mb-4 text-primary">The Vision</h2>
            <p className="text-foreground leading-relaxed">
              In a world of curated personas and algorithmic feeds, The Wall is different. 
              It's raw. Real. Permanent. A digital monument to human vulnerability, 
              built on technology that can't be corrupted. Welcome to the future of authentic connection.
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
}
