import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Engineer",
    company: "Hired at Google",
    content:
      "FlowjobAI completely transformed my job search. The CV optimization feature helped me land interviews at top tech companies within 2 weeks.",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Product Manager",
    company: "Hired at Stripe",
    content:
      "The cover letter generator saved me hours every day. Each letter was perfectly tailored and I got callbacks from 60% of my applications.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "UX Designer",
    company: "Hired at Airbnb",
    content:
      "The interview prep feature was a game-changer. I walked into every interview feeling confident and prepared for exactly what they asked.",
    rating: 5,
  },
  {
    name: "David Kim",
    role: "Data Scientist",
    company: "Hired at Netflix",
    content:
      "I was skeptical about AI job tools, but FlowjobAI exceeded my expectations. The job matching is incredibly accurate.",
    rating: 5,
  },
  {
    name: "Amanda Foster",
    role: "Marketing Director",
    company: "Hired at Spotify",
    content:
      "From application tracking to interview prep, FlowjobAI has everything. It's like having a career coach in your pocket.",
    rating: 5,
  },
  {
    name: "James Wilson",
    role: "Full Stack Developer",
    company: "Hired at Meta",
    content:
      "The ATS optimization alone is worth the price. My application response rate went from 5% to over 40% with FlowjobAI.",
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Loved by job seekers worldwide</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands who have landed their dream jobs with FlowjobAI
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-warning text-warning" />
                ))}
              </div>
              <p className="text-foreground mb-6">{`"${testimonial.content}"`}</p>
              <div>
                <p className="font-semibold text-foreground">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                <p className="text-sm text-primary">{testimonial.company}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
