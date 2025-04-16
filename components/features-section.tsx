import { MessageSquare, Users, Shield, Zap, Sparkles, Palette } from "lucide-react"

const features = [
  {
    icon: <MessageSquare className="h-8 w-8 text-sand-500" />,
    title: "Real-time Messaging",
    description: "Experience instant communication with messages that appear as if rising from the desert sands.",
  },
  {
    icon: <Users className="h-8 w-8 text-sand-500" />,
    title: "Group Conversations",
    description: "Create private or public chat rooms for friends, family, or colleagues to connect.",
  },
  {
    icon: <Palette className="h-8 w-8 text-sand-500" />,
    title: "Dynamic Themes",
    description: "Customize your experience with beautiful desert-inspired themes from dawn to dusk.",
  },
  {
    icon: <Shield className="h-8 w-8 text-sand-500" />,
    title: "Secure Chats",
    description: "End-to-end encryption ensures your conversations remain as private as a secluded oasis.",
  },
  {
    icon: <Zap className="h-8 w-8 text-sand-500" />,
    title: "Lightning Fast",
    description: "Our optimized platform delivers messages with the speed of desert winds.",
  },
  {
    icon: <Sparkles className="h-8 w-8 text-sand-500" />,
    title: "Beautiful Interface",
    description: "Enjoy a visually stunning experience inspired by the tranquil beauty of desert landscapes.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-sand-50 dark:bg-dune-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-dune-800 dark:text-sand-100">
            Features that Flow Like Sand
          </h2>
          <p className="text-lg text-dune-600 dark:text-sand-300 max-w-2xl mx-auto">
            Discover the unique capabilities of Mirsal that blend ancient desert tranquility with cutting-edge
            technology.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white dark:bg-dune-800 rounded-xl shadow-sm border border-sand-200 dark:border-dune-700 hover:shadow-md transition-shadow"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-dune-800 dark:text-sand-100">{feature.title}</h3>
              <p className="text-dune-600 dark:text-sand-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
