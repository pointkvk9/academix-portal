import { GovtHeader } from "@/components/GovtHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  Calendar, 
  Building2, 
  Mail, 
  Phone, 
  Users, 
  Shield, 
  Award, 
  Target, 
  Heart, 
  TrendingUp, 
  Scale, 
  Clock, 
  MapPin, 
  FileText, 
  UserCheck, 
  ExternalLink,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Globe,
  Banknote,
  GraduationCap,
  HandHeart,
  Lightbulb,
  ChevronRight,
  Star,
  Zap,
  Sparkles,
  Trophy,
  Menu,
  X,
  Donate,
  BookOpen,
  TreePalm,
  Home
} from "lucide-react";

const CompanyHome = () => {
  const navigate = useNavigate();
  const [showExamPopup, setShowExamPopup] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Society Information from PDF
  const societyInfo = {
    name: "किसान विकास कार्यदाई संस्था",
    nameEnglish: "Kisan Vikas Karyadayi Sanstha",
    registrationNumber: "VAR/07494/2024-2025",
    registrationDate: "27/01/2025",
    validUntil: "26/01/2030",
    registeredUnder: "Societies Registration Act, 1860 (Act No. 21, 1860)",
    registeredAddress: "ग्राम बीरभानपुर, जिला वाराणसी, Varanasi, Uttar Pradesh - 221311",
    email: "kvk2025vns@gmail.com",
    phone: "9415197588",
    workArea: "सम्पूर्ण उत्तर प्रदेश (Entire Uttar Pradesh)",
    registrar: "Registrar of Societies, Uttar Pradesh",
    digitallySignedBy: "Mangalesh Singh Paliwal"
  };

  // Founding Members from PDF (Page 5)
  const foundingMembers = [
    { name: "श्री सदीप कुमार पटेल", fatherName: "श्री राम बलि पटेल", role: "Founder Member" },
    { name: "श्री चंदन सिंह पटेल", fatherName: "श्री राम प्रकाश पटेल", role: "Founder Member" },
    { name: "श्री ठाकुर प्रसाद", fatherName: "श्री राम कुमार", role: "Founder Member" },
    { name: "श्री जय शंकर वर्मा", fatherName: "श्री रामाशंकर वर्मा", role: "Founder Member" },
    { name: "श्री रविन्द्र कुमार", fatherName: "श्री नागेश प्रसाद", role: "Founder Member" },
    { name: "श्री आशीष कुमार", fatherName: "श्री रामशीरोमणी", role: "Founder Member" },
    { name: "श्री मनोज कुमार सिंह", fatherName: "श्री लालबहादुर सिंह", role: "Founder Member" },
    { name: "श्री विद्या शंकर वर्मा", fatherName: "श्री रामाशंकर वर्मा", role: "Founder Member" }
  ];

  // Management Committee Structure from PDF
  const managementCommittee = {
    totalMembers: 7,
    positions: [
      { title: "अध्यक्ष", english: "President", count: 1 },
      { title: "उपाध्यक्ष", english: "Vice President", count: 1 },
      { title: "कोषाध्यक्ष", english: "Treasurer", count: 1 },
      { title: "प्रबन्धक/सचिव", english: "Manager/Secretary", count: 1 },
      { title: "सदस्य", english: "Members", count: 3 }
    ]
  };

  // Services - Updated to Donation/Community Focus
  const services = [
    {
      icon: HandHeart,
      title: "Donation Programs",
      description: "Support our community development initiatives through generous donations.",
      features: ["One-time Donation", "Monthly Support", "Corporate Partnership", "Zakat/Sadaqah"],
      color: "from-red-500 to-pink-500"
    },
    {
      icon: GraduationCap,
      title: "Educational Support",
      description: "Providing scholarships and educational resources to underprivileged students.",
      features: ["Scholarship Programs", "Exam Portal", "Study Materials", "Career Guidance"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: TreePalm,
      title: "Rural Development",
      description: "Working for the development of rural infrastructure and community welfare.",
      features: ["Infrastructure Projects", "Village Development", "Clean Water Initiatives", "Sanitation Programs"],
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Heart,
      title: "Community Welfare",
      description: "Healthcare support, food distribution, and assistance for needy families.",
      features: ["Healthcare Camps", "Food Distribution", "Winter Relief", "Emergency Assistance"],
      color: "from-orange-500 to-red-500"
    }
  ];

  const initiatives = [
    {
      icon: Trophy,
      title: "सामान्य ज्ञान प्रतियोगिता",
      titleEn: "General Knowledge Competition",
      description: "Annual GK competition for students with cash prizes and certificates.",
      impact: "500+ Students Participated",
      year: "2024"
    },
    {
      icon: Home,
      title: "ग्राम विकास कार्यक्रम",
      titleEn: "Rural Development Program",
      description: "Supporting rural infrastructure and community development projects.",
      impact: "10+ Villages Benefited",
      year: "2023-24"
    },
    {
      icon: Users,
      title: "महिला सशक्तिकरण",
      titleEn: "Women Empowerment",
      description: "Skill development and self-help groups for women entrepreneurs.",
      impact: "50+ Women Trained",
      year: "2024"
    },
    {
      icon: Lightbulb,
      title: "डिजिटल साक्षरता अभियान",
      titleEn: "Digital Literacy Drive",
      description: "Teaching digital skills to rural communities for better opportunities.",
      impact: "100+ People Trained",
      year: "2023-24"
    }
  ];

  const whyChooseUs = [
    { icon: Shield, title: "Government Registered", desc: "Registered under Societies Registration Act 1860" },
    { icon: Users, title: "Community Focused", desc: "Committed to rural development and community welfare" },
    { icon: Scale, title: "Transparent Operations", desc: "Regular general body meetings and audited accounts" },
    { icon: Clock, title: "Established 2025", desc: "Newly registered society with clear vision" },
    { icon: Heart, title: "Social Impact", desc: "Making real difference in communities" },
    { icon: Star, title: "Member Benefits", desc: "Exclusive benefits for registered members" }
  ];

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <GovtHeader />
      
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div className="fixed top-0 right-0 bottom-0 w-64 bg-white shadow-xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-end mb-6">
              <button onClick={() => setMobileMenuOpen(false)} className="p-2">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-col space-y-4">
              <button onClick={() => scrollToSection('services')} className="text-left py-2 hover:text-primary transition-colors">Services</button>
              <button onClick={() => scrollToSection('initiatives')} className="text-left py-2 hover:text-primary transition-colors">Initiatives</button>
              <button onClick={() => scrollToSection('members')} className="text-left py-2 hover:text-primary transition-colors">Founding Members</button>
              <button onClick={() => scrollToSection('contact')} className="text-left py-2 hover:text-primary transition-colors">Contact</button>
              <Button className="w-full mt-4" onClick={() => navigate("/exam")}>
                Exam Portal
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Exam Portal Notification Bar */}
      <div 
        className="bg-green-600 hover:bg-yellow-300 cursor-pointer transition-colors py-2 md:py-3 px-3 md:px-4 border-b border-red-700"
        onClick={() => setShowExamPopup(true)}
      >
        <div className="container mx-auto">
          <div className="flex items-center justify-center gap-2 md:gap-3 flex-wrap">
            <div className="animate-pulse flex-shrink-0">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <p className="text-white text-xs md:text-sm lg:text-base font-bold text-center">
              📢 EXAM PORTAL | सामान्य ज्ञान प्रतियोगिता 2026-27 | रजिस्ट्रेशन शुरू — Click Here!
            </p>
            <ChevronRight className="h-3 w-3 md:h-4 md:w-4 text-white flex-shrink-0" />
          </div>
        </div>
      </div>

      {/* Exam Portal Popup Modal */}
      {showExamPopup && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-3 md:p-4" onClick={() => setShowExamPopup(false)}>
          <div className="bg-white rounded-xl md:rounded-2xl max-w-[90%] md:max-w-md w-full p-4 md:p-6 shadow-2xl animate-in zoom-in-95 duration-200 mx-3" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-3 md:mb-4">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
                <GraduationCap className="h-6 w-6 md:h-8 md:w-8 text-red-600" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900">Exam Portal</h3>
              <p className="text-gray-600 text-xs md:text-sm mt-1">सामान्य ज्ञान प्रतियोगिता 2026-27</p>
            </div>
            <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
              <div className="bg-gray-50 p-2 md:p-3 rounded-lg">
                <p className="text-xs md:text-sm font-semibold">📅 Registration Dates</p>
                <p className="text-[11px] md:text-xs text-gray-600">24 March 2026 - 24 April 2026</p>
              </div>
              <div className="bg-gray-50 p-2 md:p-3 rounded-lg">
                <p className="text-xs md:text-sm font-semibold">💰 Exam Fee</p>
                <p className="text-[11px] md:text-xs text-gray-600">Only ₹50/-</p>
              </div>
              <div className="bg-gray-50 p-2 md:p-3 rounded-lg">
                <p className="text-xs md:text-sm font-semibold">🏆 Prize Amount</p>
                <p className="text-[11px] md:text-xs text-gray-600">Up to ₹3,001 + Certificates</p>
              </div>
            </div>
            <div className="flex gap-2 md:gap-3">
              <Button className="flex-1 bg-red-600 hover:bg-red-700 text-sm md:text-base" onClick={() => {
                setShowExamPopup(false);
                navigate("/exam");
              }}>
                Apply Now
              </Button>
              <Button variant="outline" className="flex-1 text-sm md:text-base" onClick={() => setShowExamPopup(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="relative py-12 md:py-16 lg:py-20 px-4">
          <div className="container mx-auto text-center max-w-4xl">
            <Badge className="bg-accent/20 text-accent border-accent/40 mb-4 md:mb-6 px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm animate-bounce inline-flex items-center gap-1 md:gap-2">
              <Building2 className="h-3 w-3 md:h-4 md:w-4" />
              <span>Registered under Societies Registration Act 1860</span>
            </Badge>
            <h1 className="text-2xl md:text-4xl lg:text-6xl font-black mb-3 md:mb-4 leading-tight text-primary-foreground px-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              {societyInfo.name}
            </h1>
            <p className="text-base md:text-xl lg:text-2xl text-primary-foreground/80 mb-2 font-medium px-2">
              {societyInfo.nameEnglish}
            </p>
            <p className="text-xs md:text-sm text-primary-foreground/60 mb-6 md:mb-8 max-w-2xl mx-auto px-4">
              A Government Registered Society committed to rural development, educational empowerment, 
              and community welfare in Uttar Pradesh.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center px-4">
              <Button size={isMobile ? "default" : "lg"} className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-sm md:text-base px-6 md:px-8 w-full sm:w-auto" onClick={() => scrollToSection('services')}>
                Support Our Cause <ChevronRight className="ml-2 h-3 w-3 md:h-4 md:w-4" />
              </Button>
              <Button
                size={isMobile ? "default" : "lg"}
                variant="outline"
                className="border-primary-foreground/40 text-primary-foreground bg-primary-foreground/10 hover:bg-primary-foreground/20 font-semibold text-sm md:text-base w-full sm:w-auto"
                onClick={() => scrollToSection('contact')}
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Registration Certificate Badge */}
      <div className="bg-muted/50 border-b">
        <div className="container mx-auto py-2 md:py-3 px-4">
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 text-[10px] md:text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              Reg. No: {societyInfo.registrationNumber}
            </span>
            <span>•</span>
            <span>Valid Till: {societyInfo.validUntil}</span>
            <span>•</span>
            <span>Work Area: {societyInfo.workArea}</span>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <section id="services" className="py-12 md:py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <Badge className="bg-primary/10 text-primary mb-2 md:mb-3 text-xs md:text-sm">What We Do</Badge>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4">Our Programs</h2>
            <div className="w-16 md:w-20 h-1 bg-accent mx-auto mb-4 md:mb-6" />
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto px-4">
              Join us in making a difference through our community development and welfare programs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {services.map((service, i) => (
              <Card key={i} className="hover:shadow-xl transition-all duration-300 group overflow-hidden">
                <div className={`h-1 md:h-2 bg-gradient-to-r ${service.color}`} />
                <CardContent className="p-4 md:p-6">
                  <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform">
                    <service.icon className="h-5 w-5 md:h-7 md:w-7 text-primary" />
                  </div>
                  <h3 className="text-base md:text-lg font-bold mb-1 md:mb-2">{service.title}</h3>
                  <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">{service.description}</p>
                  <ul className="space-y-1 md:space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="text-[10px] md:text-xs flex items-center gap-1 md:gap-2 text-muted-foreground">
                        <div className="w-1 h-1 rounded-full bg-accent flex-shrink-0" />
                        <span className="truncate">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Initiatives Section */}
      <section id="initiatives" className="py-12 md:py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <Badge className="bg-primary/10 text-primary mb-2 md:mb-3 text-xs md:text-sm">Community Impact</Badge>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4">Our Initiatives</h2>
            <div className="w-16 md:w-20 h-1 bg-accent mx-auto mb-4 md:mb-6" />
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto px-4">
              Making a difference through meaningful programs and community engagement.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {initiatives.map((initiative, i) => (
              <Card key={i} className="hover:shadow-lg transition-all group">
                <CardContent className="p-4 md:p-6 text-center">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3 md:mb-4 group-hover:bg-accent/20 transition-colors">
                    <initiative.icon className="h-6 w-6 md:h-8 md:w-8 text-accent" />
                  </div>
                  <h3 className="text-sm md:text-base font-bold mb-0.5">{initiative.title}</h3>
                  <p className="text-[10px] md:text-xs text-muted-foreground mb-1 md:mb-2">{initiative.titleEn}</p>
                  <p className="text-xs md:text-sm text-muted-foreground mb-2 md:mb-3">{initiative.description}</p>
                  <div className="pt-2 md:pt-3 border-t">
                    <p className="text-[10px] md:text-xs font-semibold text-primary">{initiative.impact}</p>
                    <p className="text-[9px] md:text-xs text-muted-foreground">Since {initiative.year}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Society Overview Section */}
      <section className="py-12 md:py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 md:mb-12">
            <Badge className="bg-primary/10 text-primary mb-2 md:mb-3 text-xs md:text-sm">About Us</Badge>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4">Society Overview</h2>
            <div className="w-16 md:w-20 h-1 bg-accent mx-auto mb-4 md:mb-6" />
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-10">
            <div>
              <div className="bg-card p-4 md:p-6 rounded-xl border shadow-sm">
                <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 flex items-center gap-2">
                  <Building2 className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                  Registration Details
                </h3>
                <div className="space-y-2 md:space-y-3 text-xs md:text-sm">
                  <div className="flex flex-col sm:flex-row justify-between py-2 border-b gap-1 sm:gap-0">
                    <span className="text-muted-foreground">Registration Number</span>
                    <span className="font-mono font-medium break-all">{societyInfo.registrationNumber}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between py-2 border-b gap-1 sm:gap-0">
                    <span className="text-muted-foreground">Registered Under</span>
                    <span className="font-medium">{societyInfo.registeredUnder}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between py-2 border-b gap-1 sm:gap-0">
                    <span className="text-muted-foreground">Registration Date</span>
                    <span className="font-medium">{societyInfo.registrationDate}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between py-2 border-b gap-1 sm:gap-0">
                    <span className="text-muted-foreground">Valid Until</span>
                    <span className="font-medium">{societyInfo.validUntil}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between py-2 border-b gap-1 sm:gap-0">
                    <span className="text-muted-foreground">Work Area</span>
                    <span className="font-medium">{societyInfo.workArea}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between py-2 gap-1 sm:gap-0">
                    <span className="text-muted-foreground">Registrar</span>
                    <span className="font-medium">{societyInfo.registrar}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-card p-4 md:p-6 rounded-xl border shadow-sm">
                <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 flex items-center gap-2">
                  <Target className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                  Our Vision & Mission
                </h3>
                <div className="space-y-3 md:space-y-4">
                  <div>
                    <h4 className="font-semibold text-primary mb-1 md:mb-2 text-sm md:text-base">Vision</h4>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      To empower rural communities through sustainable development, education, 
                      and social welfare initiatives across Uttar Pradesh.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary mb-1 md:mb-2 text-sm md:text-base">Mission</h4>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      To work for the welfare of farmers, women, and underprivileged communities 
                      through education, skill development, and community development programs.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary mb-1 md:mb-2 text-sm md:text-base">Core Values</h4>
                    <div className="flex flex-wrap gap-1.5 md:gap-2">
                      {["समर्पण (Dedication)", "पारदर्शिता (Transparency)", "सामुदायिक विकास (Community First)", "नवाचार (Innovation)", "सेवा भाव (Service)"].map((value, i) => (
                        <Badge key={i} variant="secondary" className="bg-primary/5 text-xs md:text-sm">{value}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Management Committee Structure */}
      <section className="py-12 md:py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <Badge className="bg-primary/10 text-primary mb-2 md:mb-3 text-xs md:text-sm">Governance</Badge>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4">Management Committee</h2>
            <div className="w-16 md:w-20 h-1 bg-accent mx-auto mb-4 md:mb-6" />
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto px-4">
              As per the Society's Rules of Association
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 max-w-3xl mx-auto">
            {managementCommittee.positions.map((position, i) => (
              <Card key={i} className="text-center hover:shadow-md transition-all">
                <CardContent className="p-3 md:p-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                    <Users className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-xs md:text-sm">{position.title}</h3>
                  <p className="text-[10px] md:text-xs text-muted-foreground">{position.english}</p>
                  <p className="text-xs md:text-sm font-semibold text-primary mt-1">{position.count}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-center text-xs text-muted-foreground mt-4">
            Total Committee Members: {managementCommittee.totalMembers}
          </p>
        </div>
      </section>

      {/* Founding Members Section */}
      <section id="members" className="py-12 md:py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <Badge className="bg-primary/10 text-primary mb-2 md:mb-3 text-xs md:text-sm">Our Founders</Badge>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4">Founding Members</h2>
            <div className="w-16 md:w-20 h-1 bg-accent mx-auto mb-4 md:mb-6" />
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto px-4">
              The dedicated individuals who established the society under the Societies Registration Act 1860.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {foundingMembers.map((member, i) => (
              <Card key={i} className="hover:shadow-xl transition-all">
                <CardContent className="p-4 md:p-6">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <UserCheck className="h-6 w-6 md:h-7 md:w-7 text-primary" />
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-center mb-1">{member.name}</h3>
                  <p className="text-[10px] md:text-xs text-muted-foreground text-center">S/o {member.fatherName}</p>
                  <div className="mt-2 md:mt-3 pt-2 border-t text-center">
                    <Badge variant="outline" className="text-[9px] md:text-xs">{member.role}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-12 md:py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <Badge className="bg-primary/10 text-primary mb-2 md:mb-3 text-xs md:text-sm">Why Trust Us</Badge>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4">Why Choose {societyInfo.nameEnglish}</h2>
            <div className="w-16 md:w-20 h-1 bg-accent mx-auto mb-4 md:mb-6" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {whyChooseUs.map((item, i) => (
              <Card key={i} className="text-center hover:border-primary/30 transition-all hover:shadow-md">
                <CardContent className="p-3 md:p-4">
                  <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2 md:mb-3">
                    <item.icon className="h-4 w-4 md:h-6 md:w-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-[10px] md:text-sm mb-0.5 md:mb-1">{item.title}</h3>
                  <p className="text-[8px] md:text-xs text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section with Map */}
      <section id="contact" className="py-12 md:py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <Badge className="bg-primary/10 text-primary mb-2 md:mb-3 text-xs md:text-sm">Get In Touch</Badge>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4">Contact Us</h2>
            <div className="w-16 md:w-20 h-1 bg-accent mx-auto mb-4 md:mb-6" />
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            <div className="bg-card p-4 md:p-6 rounded-xl border shadow-sm">
              <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Contact Information</h3>
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-start gap-2 md:gap-3">
                  <MapPin className="h-4 w-4 md:h-5 md:w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm md:text-base font-medium">Registered Office</p>
                    <p className="text-xs md:text-sm text-muted-foreground break-words">{societyInfo.registeredAddress}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 md:gap-3">
                  <Mail className="h-4 w-4 md:h-5 md:w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm md:text-base font-medium">Email</p>
                    <a href={`mailto:${societyInfo.email}`} className="text-xs md:text-sm text-accent hover:underline break-all">
                      {societyInfo.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-2 md:gap-3">
                  <Phone className="h-4 w-4 md:h-5 md:w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm md:text-base font-medium">Phone Number</p>
                    <a href={`tel:${societyInfo.phone}`} className="text-xs md:text-sm text-accent hover:underline">
                      {societyInfo.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-2 md:gap-3 pt-2 border-t">
                  <FileText className="h-4 w-4 md:h-5 md:w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm md:text-base font-medium">Registration Details</p>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      Reg. No: {societyInfo.registrationNumber}<br />
                      Valid Till: {societyInfo.validUntil}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card p-4 md:p-6 rounded-xl border shadow-sm">
              <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Our Location</h3>
              <div className="rounded-lg overflow-hidden h-48 md:h-64">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28834.063297538797!2d82.8937507!3d25.3176456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398e2e4c6b8b8b8b%3A0x8b8b8b8b8b8b8b8b!2sRajatalab%2C%20Varanasi%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  className="w-full h-full border-0"
                  title="Society Location Map - Birbhanpur, Varanasi"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <p className="text-[10px] md:text-xs text-muted-foreground mt-2 md:mt-3 text-center">
                📍 Gram Birbhanpur, Varanasi, Uttar Pradesh - 221311
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8 md:py-10 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-6 md:mb-8">
            <div>
              <h4 className="font-bold mb-2 md:mb-3 text-base md:text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
                {societyInfo.name}
              </h4>
              <p className="text-[10px] md:text-xs text-primary-foreground/70 leading-relaxed">
                A Government Registered Society committed to rural development, educational empowerment, 
                and community welfare in Uttar Pradesh.
              </p>
              <div className="flex gap-2 md:gap-3 mt-3 md:mt-4">
                <a href="#" className="text-primary-foreground/60 hover:text-accent transition-colors">
                  <Facebook className="h-3 w-3 md:h-4 md:w-4" />
                </a>
                <a href="#" className="text-primary-foreground/60 hover:text-accent transition-colors">
                  <Twitter className="h-3 w-3 md:h-4 md:w-4" />
                </a>
                <a href="#" className="text-primary-foreground/60 hover:text-accent transition-colors">
                  <Linkedin className="h-3 w-3 md:h-4 md:w-4" />
                </a>
                <a href="#" className="text-primary-foreground/60 hover:text-accent transition-colors">
                  <Instagram className="h-3 w-3 md:h-4 md:w-4" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-2 md:mb-3 text-xs md:text-sm">Society Info</h4>
              <ul className="text-[10px] md:text-xs text-primary-foreground/70 space-y-1 md:space-y-2">
                <li>Reg. No: {societyInfo.registrationNumber}</li>
                <li>Registered: {societyInfo.registrationDate}</li>
                <li>Valid Till: {societyInfo.validUntil}</li>
                <li>Under: Societies Registration Act 1860</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-2 md:mb-3 text-xs md:text-sm">Quick Links</h4>
              <ul className="text-[10px] md:text-xs text-primary-foreground/70 space-y-1 md:space-y-2">
                <li>
                  <button onClick={() => scrollToSection('services')} className="hover:text-accent transition-colors">
                    Our Programs
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('initiatives')} className="hover:text-accent transition-colors">
                    Initiatives
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('members')} className="hover:text-accent transition-colors">
                    Founding Members
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('contact')} className="hover:text-accent transition-colors">
                    Contact Us
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-2 md:mb-3 text-xs md:text-sm">Contact</h4>
              <div className="text-[10px] md:text-xs text-primary-foreground/70 space-y-1 md:space-y-2">
                <p className="flex items-center gap-1 md:gap-2 break-all">
                  <Mail className="h-2.5 w-2.5 md:h-3 md:w-3 flex-shrink-0" />
                  <a href={`mailto:${societyInfo.email}`} className="hover:text-accent break-all">{societyInfo.email}</a>
                </p>
                <p className="flex items-center gap-1 md:gap-2">
                  <Phone className="h-2.5 w-2.5 md:h-3 md:w-3 flex-shrink-0" />
                  <a href={`tel:${societyInfo.phone}`} className="hover:text-accent">{societyInfo.phone}</a>
                </p>
                <p className="flex items-start gap-1 md:gap-2">
                  <MapPin className="h-2.5 w-2.5 md:h-3 md:w-3 flex-shrink-0 mt-0.5" />
                  <span>Gram Birbhanpur, Varanasi, UP - 221311</span>
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-primary-foreground/20 pt-4 md:pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-2 md:gap-4 text-[9px] md:text-xs text-primary-foreground/50 text-center">
              <p>© {new Date().getFullYear()} {societyInfo.name} — All Rights Reserved.</p>
              <p>Registered under Societies Registration Act, 1860 (Act No. 21, 1860) | Reg. No: {societyInfo.registrationNumber}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CompanyHome;
