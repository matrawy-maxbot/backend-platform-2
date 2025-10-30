"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  Star,
  Users,
  Zap,
  Shield,
  Globe,
  Gamepad2,
  ShoppingBag,
  Server,
  TrendingUp,
  Award,
  Heart,
  ChevronUp,
  ChevronDown
} from "lucide-react"
import Link from "next/link"
import EnhancedAnimatedBackground from "@/components/enhanced-animated-background"
import { useEffect, useRef, useState } from "react"

export default function HomePage() {
  const [currentSection, setCurrentSection] = useState(0)
  const sectionsRef = useRef<(HTMLElement | null)[]>([])
  const isScrollingRef = useRef(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  // Navigation functions
  const scrollToSection = (sectionIndex: number) => {
    const section = sectionsRef.current[sectionIndex];
    if (section && !isScrollingRef.current) {
      isScrollingRef.current = true;
      setCurrentSection(sectionIndex);
      section.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 1000);
    }
  };

  const handlePrevSection = () => {
    if (currentSection > 0) {
      scrollToSection(currentSection - 1);
    }
  };

  const handleNextSection = () => {
    if (currentSection < sectionsRef.current.length - 1) {
      scrollToSection(currentSection + 1);
    }
  };

  // Wheel event handler
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isScrollingRef.current) return;
      
      e.preventDefault();
      
      if (e.deltaY > 0 && currentSection < sectionsRef.current.length - 1) {
        scrollToSection(currentSection + 1);
      } else if (e.deltaY < 0 && currentSection > 0) {
        scrollToSection(currentSection - 1);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [currentSection]);

  // Scroll observer to update current section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isScrollingRef.current) {
            const sectionIndex = sectionsRef.current.findIndex(section => section === entry.target);
            if (sectionIndex !== -1) {
              setCurrentSection(sectionIndex);
            }
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: '-10% 0px -10% 0px'
      }
    );

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);









  return (
    <>
      <EnhancedAnimatedBackground />
      
      {/* Navigation Controls */}
       <div className="fixed left-6 top-1/2 transform -translate-y-1/2 z-50 flex flex-col items-center gap-4">
         {/* Up Button */}
         <button
           onClick={handlePrevSection}
           disabled={currentSection === 0}
           className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:scale-110 transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
         >
           <ChevronUp className="h-5 w-5" />
         </button>
         
         {/* Section Indicators */}
         <div className="flex flex-col gap-2">
           {Array.from({ length: 7 }, (_, index) => (
             <button
               key={index}
               onClick={() => scrollToSection(index)}
               className={`w-3 h-3 rounded-full transition-all duration-300 ${
                 currentSection === index
                   ? 'bg-white scale-125 shadow-lg'
                   : 'bg-white/30 hover:bg-white/50'
               }`}
             />
           ))}
         </div>
         
         {/* Down Button */}
         <button
           onClick={handleNextSection}
           disabled={currentSection === 6}
           className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 hover:scale-110 transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
         >
           <ChevronDown className="h-5 w-5" />
         </button>
       </div>


      
      <div className="relative min-h-screen z-10">
      {/* Hero Section - القسم الأول */}
      <section ref={(el) => sectionsRef.current[0] = el} className="relative overflow-hidden min-h-screen flex items-center -mt-20">
        {/* Full Cover Background Video */}
        <div className="absolute inset-0 w-full h-full">
          <video
            src="/defaults/11.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="object-cover w-full h-full"
          />
          {/* Transparent gradient overlay from right to left */}
          <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/30 to-transparent"></div>
        </div>
        
        {/* Content overlay */}
        <div className="relative z-20 w-full flex items-center justify-end min-h-screen pt-4 pr-8 md:pr-16">
          <div className="text-right text-white px-4 max-w-2xl">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 drop-shadow-2xl">
              Welcome to Our Integrated Platform
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl opacity-90 drop-shadow-lg mb-8">
              Discover a world of unlimited possibilities
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                Get Started
                <ArrowRight className="mr-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black px-8 py-4 text-lg">
                Learn More
              </Button>
            </div>
          </div>
        </div>
        

      </section>

      {/* Second Section - Artboard 2 */}
      <section ref={(el) => sectionsRef.current[1] = el} className="relative overflow-hidden min-h-screen">
        {/* Full Cover Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src="/defaults/Artboard 2.png"
            alt="Artboard 2"
            className="object-cover w-full h-full"
          />
        </div>
      </section>

      {/* Third Section - New Image */}
      <section ref={(el) => sectionsRef.current[2] = el} className="relative overflow-hidden min-h-screen">
        {/* Full Cover Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src="/defaults/Artboard 3.png"
            alt="Artboard 3"
            className="object-cover w-full h-full"
          />
        </div>
      </section>

      {/* Features Section */}
      <section ref={(el) => sectionsRef.current[3] = el} className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose Our Elite Platform?
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Experience our comprehensive suite of premium services designed to exceed your technical and entertainment expectations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Server,
                title: "Elite Servers",
                description: "Premium high-performance servers with guaranteed 99.9% uptime",
                color: "text-blue-400",
                bgColor: "bg-blue-500/10"
              },
              {
                icon: Gamepad2,
                title: "Epic Gaming",
                description: "Extensive collection of games and competitive tournaments",
                color: "text-green-400",
                bgColor: "bg-green-500/10"
              },
              {
                icon: ShoppingBag,
                title: "Premium Store",
                description: "Secure shopping experience with exclusive deals and competitive prices",
                color: "text-purple-400",
                bgColor: "bg-purple-500/10"
              },
              {
                icon: Shield,
                title: "Military-Grade Security",
                description: "Enterprise-level protection for your data and complete privacy",
                color: "text-yellow-400",
                bgColor: "bg-yellow-500/10"
              }
            ].map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all duration-300 hover:scale-105">
                  <CardHeader className="text-center">
                    <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                      <Icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-white text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-400 text-center">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section ref={(el) => sectionsRef.current[4] = el} className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Instant Access Hub
            </h2>
            <p className="text-gray-400 text-lg">
              Jump directly to your desired destination with one click
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Servers",
                description: "Effortlessly manage and configure your premium servers",
                icon: Server,
                href: "/servers",
                color: "from-blue-500 to-blue-600",
                stats: "50+ Active Servers"
              },
              {
                title: "Gaming",
                description: "Discover the latest games and tournaments",
                icon: Gamepad2,
                href: "/gaming",
                color: "from-green-500 to-green-600",
                stats: "100+ Available Games"
              },
              {
                title: "Store",
                description: "Shop the best products and services",
                icon: ShoppingBag,
                href: "/store",
                color: "from-purple-500 to-purple-600",
                stats: "1000+ Products"
              }
            ].map((section, index) => {
              const Icon = section.icon
              return (
                <Link key={index} href={section.href}>
                  <Card className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all duration-300 hover:scale-105 cursor-pointer group">
                    <CardHeader>
                      <div className={`w-16 h-16 bg-gradient-to-r ${section.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-white text-xl mb-2">{section.title}</CardTitle>
                      <CardDescription className="text-gray-400">
                        {section.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="bg-gray-800 text-gray-300">
                          {section.stats}
                        </Badge>
                        <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={(el) => sectionsRef.current[5] = el} className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Active Users", value: "10K+", icon: Users },
              { label: "Managed Servers", value: "500+", icon: Server },
              { label: "Satisfaction Rate", value: "99%", icon: Heart },
              { label: "Years of Experience", value: "5+", icon: Award }
            ].map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={(el) => sectionsRef.current[6] = el} className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of users who trust our platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
              Start Free
              <Star className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
              Contact Us
            </Button>
          </div>
        </div>
      </section>
      </div>
    </>
  )
}