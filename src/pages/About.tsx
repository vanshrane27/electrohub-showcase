import { Layout } from '@/components/layout/Layout';
import { Target, Eye, Award, Users, Zap, Shield, Headphones, Lightbulb } from 'lucide-react';

const team = [
  { name: 'Rajesh Verma', role: 'CEO & Founder', image: 'RV' },
  { name: 'Anita Desai', role: 'CTO', image: 'AD' },
  { name: 'Sameer Patel', role: 'Head of Design', image: 'SP' },
  { name: 'Meera Krishnan', role: 'VP of Sales', image: 'MK' },
];

const whyChooseUs = [
  { icon: Award, title: 'Quality Assurance', desc: 'Every product undergoes rigorous testing before reaching you.' },
  { icon: Shield, title: 'Extended Warranty', desc: 'Industry-leading 3-year warranty on all products.' },
  { icon: Headphones, title: '24/7 Support', desc: 'Our dedicated team is always here to help you.' },
  { icon: Lightbulb, title: 'Innovation', desc: 'Constantly pushing boundaries with cutting-edge technology.' },
];

const milestones = [
  { year: '2010', event: 'Company founded in Bangalore' },
  { year: '2013', event: 'Launched first gaming laptop series' },
  { year: '2016', event: 'Expanded to international markets' },
  { year: '2018', event: 'Introduced smart TV lineup' },
  { year: '2020', event: 'Reached 1 million customers' },
  { year: '2023', event: 'Launched Creator workstation series' },
];

export default function About() {
  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Hero */}
        <div className="relative bg-card border-b border-border py-20 overflow-hidden">
          <div className="absolute inset-0 gradient-glow opacity-30" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">
              About <span className="text-gradient">NexaTech</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Since 2010, we've been on a mission to bring cutting-edge technology to homes and businesses across the globe. Our passion for innovation drives us to create products that don't just meet expectations—they exceed them.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Story */}
          <section className="mb-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-heading text-3xl font-bold mb-6">Our Story</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    NexaTech was born from a simple idea: technology should empower everyone. Founded in Bangalore by a team of passionate engineers and designers, we started with a dream to create electronics that combine premium quality with accessible pricing.
                  </p>
                  <p>
                    What began in a small garage has grown into one of India's leading electronics manufacturers. Today, we operate state-of-the-art manufacturing facilities and serve customers in over 20 countries.
                  </p>
                  <p>
                    Our journey has been marked by continuous innovation—from launching India's first affordable gaming laptop to pioneering smart TV technology with local content integration. Every product we create is a testament to our commitment to excellence.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card rounded-xl border border-border p-6 text-center">
                  <div className="font-heading text-4xl font-bold text-primary mb-2">14+</div>
                  <div className="text-muted-foreground">Years of Excellence</div>
                </div>
                <div className="bg-card rounded-xl border border-border p-6 text-center">
                  <div className="font-heading text-4xl font-bold text-primary mb-2">2M+</div>
                  <div className="text-muted-foreground">Happy Customers</div>
                </div>
                <div className="bg-card rounded-xl border border-border p-6 text-center">
                  <div className="font-heading text-4xl font-bold text-primary mb-2">20+</div>
                  <div className="text-muted-foreground">Countries Served</div>
                </div>
                <div className="bg-card rounded-xl border border-border p-6 text-center">
                  <div className="font-heading text-4xl font-bold text-primary mb-2">500+</div>
                  <div className="text-muted-foreground">Team Members</div>
                </div>
              </div>
            </div>
          </section>

          {/* Mission & Vision */}
          <section className="mb-20">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-card rounded-2xl border border-border p-8">
                <div className="w-14 h-14 gradient-primary rounded-xl flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="font-heading text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-muted-foreground">
                  To democratize technology by creating innovative, high-quality electronics that are accessible to everyone. We believe that cutting-edge technology shouldn't be a luxury—it should be a right.
                </p>
              </div>
              <div className="bg-card rounded-2xl border border-border p-8">
                <div className="w-14 h-14 gradient-primary rounded-xl flex items-center justify-center mb-6">
                  <Eye className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="font-heading text-2xl font-bold mb-4">Our Vision</h3>
                <p className="text-muted-foreground">
                  To be the world's most trusted electronics brand, known for pushing the boundaries of innovation while maintaining unwavering commitment to quality and customer satisfaction.
                </p>
              </div>
            </div>
          </section>

          {/* Why Choose Us */}
          <section className="mb-20">
            <h2 className="font-heading text-3xl font-bold mb-8 text-center">Why Choose NexaTech?</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {whyChooseUs.map(item => (
                <div
                  key={item.title}
                  className="bg-card rounded-xl border border-border p-6 text-center hover:border-primary/50 transition-colors"
                >
                  <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h4 className="font-heading font-semibold mb-2">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Timeline */}
          <section className="mb-20">
            <h2 className="font-heading text-3xl font-bold mb-8 text-center">Our Journey</h2>
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-border hidden md:block" />
              <div className="space-y-8">
                {milestones.map((milestone, i) => (
                  <div
                    key={milestone.year}
                    className={`flex flex-col md:flex-row items-center gap-4 ${
                      i % 2 === 0 ? 'md:flex-row-reverse' : ''
                    }`}
                  >
                    <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : ''}`}>
                      <div className="bg-card rounded-xl border border-border p-4 inline-block">
                        <span className="font-heading font-bold text-primary">{milestone.year}</span>
                        <p className="text-muted-foreground">{milestone.event}</p>
                      </div>
                    </div>
                    <div className="w-4 h-4 gradient-primary rounded-full shadow-glow hidden md:block" />
                    <div className="flex-1" />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Team */}
          <section>
            <h2 className="font-heading text-3xl font-bold mb-8 text-center">Leadership Team</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map(member => (
                <div
                  key={member.name}
                  className="bg-card rounded-xl border border-border p-6 text-center hover:border-primary/50 transition-colors"
                >
                  <div className="w-20 h-20 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary-foreground">
                    {member.image}
                  </div>
                  <h4 className="font-heading font-semibold">{member.name}</h4>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}
