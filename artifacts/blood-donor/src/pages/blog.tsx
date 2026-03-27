import { Badge } from "@/components/ui/badge";

const BLOG_POSTS = [
  {
    title: "Why Donate Blood?",
    tag: "Awareness",
    tagColor: "bg-blue-100 text-blue-800",
    desc: "Discover the profound impact a single donation can make on multiple lives and the health benefits for the donor.",
  },
  {
    title: "Who Can Donate?",
    tag: "Eligibility",
    tagColor: "bg-green-100 text-green-800",
    desc: "Learn about the basic requirements, age limits, and health conditions necessary to become a blood donor.",
  },
  {
    title: "Is Blood Donation Safe?",
    tag: "Safety",
    tagColor: "bg-purple-100 text-purple-800",
    desc: "Understand the strict protocols and sterile equipment used to ensure complete safety during the donation process.",
  },
  {
    title: "Common Myths",
    tag: "Myths",
    tagColor: "bg-orange-100 text-orange-800",
    desc: "We debunk the most common misconceptions about blood donation that might be holding you back.",
  },
  {
    title: "After Donation Care",
    tag: "Care",
    tagColor: "bg-pink-100 text-pink-800",
    desc: "Essential tips and guidelines on what to eat, drink, and avoid immediately after donating blood.",
  },
  {
    title: "One Donation, Many Lives",
    tag: "Impact",
    tagColor: "bg-primary/20 text-primary",
    desc: "How blood is separated into red cells, plasma, and platelets to help up to three different patients.",
  }
];

export default function Blog() {
  return (
    <div className="min-h-[80vh] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 font-display">Blood Donation Resources</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to know about blood donation, eligibility, and the impact you can make.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post, i) => (
            <div key={i} className="bg-white rounded-2xl p-8 border border-border shadow-sm hover:shadow-lg transition-all flex flex-col h-full cursor-pointer group">
              <Badge className={`w-fit mb-4 border-0 shadow-none px-3 py-1 text-xs uppercase tracking-wider font-bold ${post.tagColor}`}>
                {post.tag}
              </Badge>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">{post.title}</h3>
              <p className="text-muted-foreground leading-relaxed flex-grow">{post.desc}</p>
              <div className="mt-6 text-primary font-semibold flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                Read Article <span className="text-xl">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
