import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import "./App.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

const experiences = [
  {
    company: "LTIMindtree",
    role: "Specialist Software Engineer",
    period: "Aug 2025 – Present",
    client: "Client: Microsoft",
    description:
      "Designing and developing enterprise-grade AEM Cloud Service applications and reusable digital components.",
    technologies:
      "AEMaaCS · React · TypeScript · JavaScript · Lit · Sling Models · HTL · Sling Servlets · OSGi · REST APIs · Jest",
    highlights: [
      "Develop reusable AEM components using Sling Models, HTL and Sling Servlets.",
      "Build modern enterprise UI components using React, TypeScript, JavaScript and Lit Web Components.",
      "Integrate REST APIs and backend services.",
      "Configure Clientlibs, Templates, Content Policies, Experience Fragments and Content Fragments.",
      "Lead a small team through task allocation, technical troubleshooting, PR reviews and mentoring.",
      "Work with architects, QA and product owners in Agile delivery.",
    ],
  },
  {
    company: "Cognizant Technology Solutions",
    role: "Associate Projects",
    period: "May 2024 – Aug 2025",
    client: "Clients: Novo Nordisk · AbbVie",
    description:
      "Delivered enterprise AEM solutions and responsive frontend applications for large digital platforms.",
    technologies:
      "AEM 6.5 · React · Vue.js · TypeScript · HTL · Sling Models · Sling Servlets · OSGi · REST APIs · Jest",
    highlights: [
      "Developed reusable AEM components using Sling Models, HTL and Sling Servlets.",
      "Built Touch UI dialogs, content policies, clientlibs and reusable templates.",
      "Developed responsive enterprise interfaces using React, Vue.js and TypeScript.",
      "Integrated REST APIs and backend services.",
      "Worked on application performance and maintainability.",
      "Implemented Jest unit testing for frontend components.",
    ],
  },
  {
    company: "Infosys BPM",
    role: "Process Specialist",
    period: "Jan 2023 – May 2024",
    client: "AEM Development & Web Automation",
    description:
      "Worked on AEM architecture, responsive web development and automation of repetitive website management tasks.",
    technologies:
      "AEM · Sling · CRX · OSGi · JCR · React · JavaScript · jQuery · AJAX · VBA",
    highlights: [
      "Designed and developed AEM components, templates and dialogs.",
      "Developed interactive web features using JavaScript, React, jQuery and AJAX.",
      "Built responsive web applications for multiple devices and browsers.",
      "Automated bulk live-site conversion to AEM editor and preview pages using JavaScript and VBA.",
      "Developed a bulk site-status checker to determine live page status efficiently.",
    ],
  },
  {
    company: "Athena Health Technologies",
    role: "Content Data Management Analyst",
    period: "Jul 2021 – Jan 2023",
    client: "Healthcare Web Development",
    description:
      "Developed responsive healthcare web experiences and automated repetitive data and reporting workflows.",
    technologies:
      "HTML5 · CSS3 · JavaScript · jQuery · AJAX · React · Excel VBA · Macros",
    highlights: [
      "Developed responsive healthcare web pages for iOS, Android and web browsers.",
      "Built interfaces using HTML5, CSS3, JavaScript, jQuery, AJAX and React.",
      "Automated repetitive tasks using Excel Macros and VBA.",
      "Automated data manipulation and reporting workflows.",
      "Worked with requesters to deliver responsive webpage requirements.",
      "Created optimized digital advertisements for mobile audiences.",
    ],
  },
  {
    company: "Lumina Datamatics",
    role: "Process Executive",
    period: "Jun 2019 – Jul 2021",
    client: "Web & Digital Publishing",
    description:
      "Worked on web-based EPUB production, digital publishing and marketing/help/community websites.",
    technologies:
      "HTML5 · CSS3 · JavaScript · jQuery · Photoshop · InDesign · Illustrator · Acrobat",
    highlights: [
      "Converted source content into EPUB web applications.",
      "Developed content using HTML5, CSS3 and JavaScript.",
      "Created high-quality PDF deliverables using Adobe Creative Suite.",
      "Worked with InDesign, Illustrator, Acrobat and Photoshop.",
      "Built and published marketing, help and community websites.",
    ],
  },
  {
    company: "Maestro Software Technology",
    role: "Quality Analyst",
    period: "Apr 2017 – Jun 2019",
    client: "Web Application QA",
    description:
      "Performed functional testing and quality assurance for web applications and digital products.",
    technologies:
      "Web Testing · HTML5 · CSS3 · JavaScript · EPUB · Adobe Tools",
    highlights: [
      "Performed functional testing of web components and complete applications.",
      "Validated products against organizational compliance standards.",
      "Identified issues and supported process improvement initiatives.",
      "Worked with web technologies including HTML, CSS and JavaScript.",
    ],
  },
  {
    company: "CodeMantra",
    role: "EPUB Trainee",
    period: "Sep 2016 – Apr 2017",
    client: "Beginning of Professional Career",
    description:
      "Started professional career working with web fundamentals and EPUB production workflows.",
    technologies:
      "HTML5 · CSS3 · JavaScript · Photoshop · EPUB · Adobe Tools",
    highlights: [
      "Worked with HTML5, CSS3 and JavaScript.",
      "Learned EPUB production and web development fundamentals.",
      "Worked with Adobe tools for digital content production.",
      "Participated in on-the-job training and collaborative delivery.",
    ],
  },
];

const skillGroups = [
  {
    title: "Frontend",
    skills: [
      "React JS",
      "TypeScript",
      "JavaScript ES6+",
      "HTML5",
      "CSS3",
      "Vue.js",
      "Redux",
      "Lit Web Components",
      "Bootstrap",
      "SASS",
      "jQuery",
      "AJAX",
    ],
  },
  {
    title: "Adobe Experience Manager",
    skills: [
      "AEM Cloud Service",
      "AEM 6.5",
      "HTL",
      "Sling Models",
      "Sling Servlets",
      "OSGi",
      "JCR",
      "CRX",
      "Clientlibs",
      "Templates",
      "Components",
      "Content Policies",
      "DAM",
      "Experience Fragments",
      "Content Fragments",
      "AEM Forms",
    ],
  },
  {
    title: "Backend & APIs",
    skills: [
      "Java",
      "Node.js",
      "Express",
      "REST APIs",
      "API Integration",
      "JSON",
      "MERN Stack",
    ],
  },
  {
    title: "Testing & Engineering",
    skills: [
      "Jest",
      "JUnit",
      "Unit Testing",
      "Debugging",
      "Performance Tuning",
      "Code Optimization",
      "Peer Code Reviews",
    ],
  },
  {
    title: "Tools & Practices",
    skills: [
      "Git",
      "Azure DevOps",
      "Maven",
      "VS Code",
      "IntelliJ IDEA",
      "Agile Scrum",
      "SDLC",
      "Technical Troubleshooting",
    ],
  },
  {
    title: "AI & Automation",
    skills: [
      "AI Integration",
      "Prompt Engineering",
      "AI-assisted Development",
      "JavaScript Automation",
      "VBA Automation",
      "Workflow Automation",
      "Gemini API",
    ],
  },
];

const automations = [
  {
    icon: "⚡",
    title: "Bulk Website Migration Automation",
    description:
      "Automated conversion of bulk live websites into their respective AEM editor and preview pages using JavaScript and VBA.",
    tech: ["JavaScript", "VBA", "AEM"],
  },
  {
    icon: "🔎",
    title: "Bulk Site Status Checker",
    description:
      "Built an automation to efficiently determine the live status of a bulk list of pages, improving content management workflows.",
    tech: ["JavaScript", "VBA", "Automation"],
  },
  {
    icon: "📊",
    title: "Excel Workflow Automation",
    description:
      "Automated repetitive data manipulation, reporting and spreadsheet-based workflows using Excel Macros and VBA.",
    tech: ["Excel", "VBA", "Macros"],
  },
  {
    icon: "🤖",
    title: "AI Portfolio Assistant",
    description:
      "Building this AI-powered portfolio assistant using React, Node.js, Express and Gemini API.",
    tech: ["React", "Node.js", "Gemini API"],
  },
];

const certifications = [
  "Adobe Experience Manager (AEM Sites Developer) — Udemy",
  "React JS — LinkedIn Learning",
  "JavaScript — GUVI",
  "Python — GUVI",
  "SQL — GUVI",
  "Web Development (JavaScript Developer) — LEX Infosys",
  "Artificial Intelligence Fundamentals — Udemy",
];

function App() {

  const [chatOpen, setChatOpen] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text:
        "Hi! 👋 I'm Manimaran's AI assistant. Ask me about his experience, skills, projects, automation work or services.",
      sender: "bot",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [inquiryStatus, setInquiryStatus] = useState("");

  const [inquiryForm, setInquiryForm] = useState({
    name: "",
    email: "",
    project: "",
    budget: "",
    timeline: "",
    website: "",
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = async (messageText?: string) => {
    const trimmedMessage = (messageText ?? input).trim();

    if (!trimmedMessage || loading) {
      return;
    }

    const conversationHistory = messages.map((message) => ({
      role: message.sender,
      text: message.text,
    }));

    const userMessage: Message = {
      id: Date.now(),
      text: trimmedMessage,
      sender: "user",
    };

    setMessages((previous) => [...previous, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: trimmedMessage,
          history: conversationHistory,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setMessages((previous) => [
        ...previous,
        {
          id: Date.now() + 1,
          text: data.reply,
          sender: "bot",
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((previous) => [
        ...previous,
        {
          id: Date.now() + 1,
          text:
            "Sorry, I couldn't connect to the AI service. Please try again.",
          sender: "bot",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  const handleInquirySubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (inquiryLoading) {
      return;
    }

    setInquiryLoading(true);
    setInquiryStatus("");

    try {
      const response = await fetch(`${API_URL}/api/inquiry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inquiryForm),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Unable to submit your inquiry."
        );
      }

      setInquiryStatus(
        "Thanks! Your project inquiry has been received. Manimaran can review the details and get back to you."
      );

      setInquiryForm({
        name: "",
        email: "",
        project: "",
        budget: "",
        timeline: "",
        website: "",
      });
    } catch (error) {
      console.error(error);
      setInquiryStatus(
        error instanceof Error
          ? error.message
          : "Unable to submit your inquiry. Please try again."
      );
    } finally {
      setInquiryLoading(false);
    }
  };

  return (
    <div className="portfolio">

      {/* NAVBAR */}

      <header className="navbar">
        <a href="#home" className="brand">

          <img
            src="/profile.png"
            alt="Manimaran"
            className="nav-photo"
          />

          <span className="logo">
            Manimaran Annamalai
          </span>

        </a>

        <nav>
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#experience">Experience</a>
          <a href="#automation">Automation</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main>

        {/* HERO */}

        <section id="home" className="hero section-container">

          <div className="hero-content">

            <h1>
              Hi, I'm{" "}
              <span className="gradient-text">
                Manimaran Annamalai.
              </span>
            </h1>

            <h2>
              Specialist Software Engineer
            </h2>

            <p className="hero-description">
              9.5+ years of experience building enterprise
              web applications, AEM solutions, modern frontend
              experiences and automation-driven digital solutions.
            </p>

            <div className="hero-tags">
              <span>AEM</span>
              <span>React</span>
              <span>TypeScript</span>
              <span>AI Integration</span>
              <span>Automation</span>
            </div>

            <div className="hero-buttons">
              <a
                href="#experience"
                className="primary-button"
              >
                View My Experience
              </a>

              <a
                href="#contact"
                className="secondary-button"
              >
                Let's Talk
              </a>
            </div>

          </div>

          <div className="hero-profile-card">

            <div className="photo-wrapper">
              <div className="about-profile">
                <img
                  src="/profile.png"
                  alt="Manimaran"
                  className="about-profile-image"
                />
              </div>

            </div>

            <div className="hero-profile-info">

              <strong>
                AEM · React · AI
              </strong>

              <span>
                Full Stack & AI Engineering
              </span>

            </div>

          </div>

        </section>

        {/* STATS */}

        <section className="stats section-container">

          <div className="stat">
            <strong>9.5+</strong>
            <span>Years Experience</span>
          </div>

          <div className="stat">
            <strong>AEM</strong>
            <span>Enterprise Expertise</span>
          </div>

          <div className="stat">
            <strong>React</strong>
            <span>Frontend Engineering</span>
          </div>

          <div className="stat">
            <strong>AI</strong>
            <span>Integration & Automation</span>
          </div>

        </section>

        {/* ABOUT */}

        <section
          id="about"
          className="section-container content-section"
        >

          <div className="section-label">
            01 — ABOUT
          </div>

          <div className="section-content">

            <div className="about-intro">
              <h2>
                Building digital experiences
                <span> with engineering depth.</span>
              </h2>
            </div>

            <p>
              I'm a Specialist Software Engineer with 9.5+
              years of experience in Frontend, Full Stack and
              Adobe Experience Manager development.
            </p>

            <p>
              My experience covers enterprise web solutions,
              reusable AEM component development, Sling Models,
              Sling Servlets, React JS, Lit Web Components,
              AEM Cloud Service, HTL and backend integration.
            </p>

            <p>
              I've worked on enterprise digital solutions for
              Microsoft, Novo Nordisk and AbbVie, while also
              contributing to technical leadership, mentoring,
              code reviews and Agile delivery.
            </p>

            <p>
              I'm currently expanding my engineering work into
              AI-powered applications, chatbots, automation and
              intelligent API integrations.
            </p>

          </div>

        </section>


        {/* SKILLS */}

        <section
          id="skills"
          className="section-container content-section"
        >

          <div className="section-label">
            02 — SKILLS
          </div>

          <div className="section-content">

            <h2>
              My technical toolkit.
            </h2>

            <div className="skill-groups">

              {skillGroups.map((group) => (
                <div
                  className="skill-group"
                  key={group.title}
                >

                  <h3>
                    {group.title}
                  </h3>

                  <div className="skills-grid">

                    {group.skills.map((skill) => (
                      <span
                        className="skill-pill"
                        key={skill}
                      >
                        {skill}
                      </span>
                    ))}

                  </div>

                </div>
              ))}

            </div>

          </div>

        </section>

        {/* EXPERIENCE */}

        <section
          id="experience"
          className="section-container content-section"
        >

          <div className="section-label">
            03 — EXPERIENCE
          </div>

          <div className="section-content">

            <h2>
              9.5+ years of professional experience.
            </h2>

            <p className="section-intro">
              From web development and quality assurance
              to enterprise AEM, frontend engineering and
              AI integration.
            </p>

            <div className="timeline">

              {experiences.map((experience) => (
                <article
                  className="timeline-item"
                  key={`${experience.company}-${experience.period}`}
                >

                  <div className="timeline-marker">
                    <div className="timeline-dot"></div>
                  </div>

                  <div className="timeline-content">

                    <div className="timeline-top">

                      <div>
                        <h3>
                          {experience.role}
                        </h3>

                        <strong>
                          {experience.company}
                        </strong>

                        <span className="timeline-client">
                          {experience.client}
                        </span>
                      </div>

                      <span className="timeline-period">
                        {experience.period}
                      </span>

                    </div>

                    <p className="timeline-description">
                      {experience.description}
                    </p>

                    <div className="timeline-tech">
                      {experience.technologies}
                    </div>

                    <ul className="experience-highlights">
                      {experience.highlights.map((highlight) => (
                        <li key={highlight}>
                          {highlight}
                        </li>
                      ))}
                    </ul>

                  </div>

                </article>
              ))}

            </div>

          </div>

        </section>

        {/* AUTOMATION */}

        <section
          id="automation"
          className="section-container content-section"
        >

          <div className="section-label">
            04 — AUTOMATION
          </div>

          <div className="section-content">

            <h2>
              Turning repetitive work into{" "}
              <span>efficient workflows.</span>
            </h2>

            <p className="section-intro">
              I build practical automation solutions to save time, reduce manual work
              and improve content management processes at scale.
            </p>

            <div className="automation-grid">
              {automations
                .filter((automation) => automation.title !== "AI Portfolio Assistant")
                .map((automation) => (
                  <article className="automation-card" key={automation.title}>
                    <div className="automation-icon">
                      {automation.icon}
                    </div>

                    <h3>{automation.title}</h3>

                    <p>{automation.description}</p>

                    <div className="tag-list">
                      {automation.tech.map((tech) => (
                        <span key={tech}>{tech}</span>
                      ))}
                    </div>
                  </article>
                ))}
            </div>

          </div>

        </section>


        {/* PROJECTS */}

        <section
          id="projects"
          className="section-container content-section"
        >

          <div className="section-label">
            05 — PROJECTS
          </div>

          <div className="section-content">

            <h2>
              Selected work & current builds.
            </h2>

            <div className="project-grid">

              <article className="project-card featured-project">

                <div className="project-number">
                  01
                </div>

                <div className="project-icon">
                  🤖
                </div>

                <h3>
                  AI Portfolio Assistant
                </h3>

                <p>
                  This portfolio's AI assistant connects a
                  React interface with a Node.js backend and
                  Gemini API to create an intelligent professional
                  assistant.
                </p>

                <div className="project-tech">
                  <span>React</span>
                  <span>TypeScript</span>
                  <span>Node.js</span>
                  <span>Gemini</span>
                </div>

              </article>

              <article className="project-card">

                <div className="project-number">
                  02
                </div>

                <div className="project-icon">
                  ◈
                </div>

                <h3>
                  Enterprise AEM Solutions
                </h3>

                <p>
                  Enterprise digital experiences using AEM,
                  reusable components, React, TypeScript,
                  backend integrations and REST APIs.
                </p>

                <div className="project-tech">
                  <span>AEM</span>
                  <span>React</span>
                  <span>TypeScript</span>
                  <span>REST</span>
                </div>

              </article>

              <article className="project-card">

                <div className="project-number">
                  03
                </div>

                <div className="project-icon">
                  ⚙
                </div>

                <h3>
                  Web Automation
                </h3>

                <p>
                  JavaScript and VBA automation for bulk
                  website migration, page validation and
                  site-status workflows.
                </p>

                <div className="project-tech">
                  <span>JavaScript</span>
                  <span>VBA</span>
                  <span>AEM</span>
                </div>

              </article>

            </div>

          </div>

        </section>

        {/* EDUCATION */}

        <section
          id="education"
          className="section-container content-section"
        >

          <div className="section-label">
            06 — EDUCATION
          </div>

          <div className="section-content">

            <h2>
              Education & continuous learning.
            </h2>

            <div className="education-grid">

              <article className="education-card">

                <span>
                  CURRENTLY PURSUING
                </span>

                <h3>
                  Master of Computer Applications
                </h3>

                <strong>
                  Artificial Intelligence & Machine Learning
                </strong>

                <p>
                  Manipal University Jaipur
                </p>

                <small>
                  Online · Expected 2027 · SGPA 8.39
                </small>

              </article>

              <article className="education-card">

                <span>
                  2016
                </span>

                <h3>
                  Bachelor of Computer Applications
                </h3>

                <strong>
                  BCA
                </strong>

                <p>
                  Dr. M.G.R. Educational and Research Institute
                </p>

                <small>
                  Chennai · CGPA 7.3
                </small>

              </article>

            </div>

          </div>

        </section>

        {/* CERTIFICATIONS */}

        <section className="section-container content-section">

          <div className="section-label">
            07 — CERTIFICATIONS
          </div>

          <div className="section-content">

            <h2>
              Certifications & courses.
            </h2>

            <div className="certification-list">

              {certifications.map((certification, index) => (
                <div
                  className="certification-item"
                  key={certification}
                >

                  <span>
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <strong>
                    {certification}
                  </strong>

                </div>
              ))}

            </div>

          </div>

        </section>

        {/* CONTACT */}

        <section
          id="contact"
          className="contact-section"
        >

          <div className="section-container contact-inner">

            <div className="section-label">
              08 — CONTACT
            </div>

            <div>

              <h2>
                Have a project in mind?
              </h2>

              <p>
                Looking for help with AEM, frontend development,
                web automation or AI integration?
              </p>

              <div className="contact-details">
                <a href="mailto:mani.maran748@gmail.com">
                  <span className="contact-detail-icon">✉</span>
                  <span>mani.maran748@gmail.com</span>
                </a>

                <a href="tel:+919094119611">
                  <span className="contact-detail-icon">☎</span>
                  <span>+91 90941 19611</span>
                </a>

                <a
                  href="https://www.linkedin.com/in/manimaran-annamalai-74286a126/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="contact-detail-icon">in</span>
                  <span>LinkedIn Profile</span>
                </a>
              </div>

              <button
                className="primary-button"
                onClick={() => setChatOpen(true)}
              >
                Talk to My AI Assistant
              </button>

            </div>

          </div>

        </section>

      </main>

      {/* FLOATING AI BUTTON */}

      {!chatOpen && (
        <button
          className="ai-floating-button"
          onClick={() => setChatOpen(true)}
        >
          <span className="ai-floating-icon">
            ✦
          </span>

          Ask Manimaran AI
        </button>
      )}

      {/* AI CHAT */}

      {chatOpen && (
        <div className="chat-widget">

          <div className="chat-header">

            <div className="chat-avatar">
              AI
            </div>

            <div className="chat-title">

              <strong>
                Manimaran AI
              </strong>

              <span>
                <i></i>
                Online
              </span>

            </div>

            <button
              className="chat-close"
              onClick={() => setChatOpen(false)}
            >
              ×
            </button>

          </div>

          <div className="chat-messages">

            {messages.map((message) => (
              <div
                key={message.id}
                className={`chat-message ${
                  message.sender === "user"
                    ? "user-message"
                    : "bot-message"
                }`}
              >
                {message.sender === "bot" ? (
                  <div className="chat-markdown">
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                  </div>
                ) : (
                  message.text
                )}
              </div>
            ))}

            {loading && (
              <div className="bot-message typing">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}

            <div ref={messagesEndRef}></div>

          </div>


          {showInquiryForm && (
            <div className="inquiry-panel">
              <div className="inquiry-header">
                <div>
                  <strong>Project Inquiry</strong>
                  <span>Tell Manimaran a little about your project.</span>
                </div>
                <button
                  type="button"
                  className="inquiry-close"
                  onClick={() => {
                    setShowInquiryForm(false);
                    setInquiryStatus("");
                  }}
                  aria-label="Close project inquiry"
                >
                  ×
                </button>
              </div>

              <form className="inquiry-form" onSubmit={handleInquirySubmit}>
                <input
                  type="text"
                  name="website"
                  value={inquiryForm.website}
                  onChange={(event) =>
                    setInquiryForm({
                      ...inquiryForm,
                      website: event.target.value,
                    })
                  }
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="inquiry-honeypot"
                />
                <label>
                  Name *
                  <input
                    type="text"
                    value={inquiryForm.name}
                    onChange={(event) =>
                      setInquiryForm((previous) => ({
                        ...previous,
                        name: event.target.value,
                      }))
                    }
                    placeholder="Your name"
                    maxLength={100}
                    required
                  />
                </label>

                <label>
                  Email *
                  <input
                    type="email"
                    value={inquiryForm.email}
                    onChange={(event) =>
                      setInquiryForm((previous) => ({
                        ...previous,
                        email: event.target.value,
                      }))
                    }
                    placeholder="you@example.com"
                    maxLength={160}
                    required
                  />
                </label>

                <label>
                  Project requirement *
                  <textarea
                    value={inquiryForm.project}
                    onChange={(event) =>
                      setInquiryForm((previous) => ({
                        ...previous,
                        project: event.target.value,
                      }))
                    }
                    placeholder="What would you like to build or improve?"
                    maxLength={2000}
                    rows={4}
                    required
                  />
                </label>

                <div className="inquiry-row">
                  <label>
                    Budget
                    <input
                      type="text"
                      value={inquiryForm.budget}
                      onChange={(event) =>
                        setInquiryForm((previous) => ({
                          ...previous,
                          budget: event.target.value,
                        }))
                      }
                      placeholder="e.g. $500"
                      maxLength={80}
                    />
                  </label>

                  <label>
                    Timeline
                    <input
                      type="text"
                      value={inquiryForm.timeline}
                      onChange={(event) =>
                        setInquiryForm((previous) => ({
                          ...previous,
                          timeline: event.target.value,
                        }))
                      }
                      placeholder="e.g. 2 weeks"
                      maxLength={80}
                    />
                  </label>
                </div>

                {inquiryStatus && (
                  <div className={`inquiry-status ${inquiryStatus.startsWith("Thanks!") ? "success" : "error"}`}>
                    {inquiryStatus}
                  </div>
                )}

                <button
                  type="submit"
                  className="inquiry-submit"
                  disabled={inquiryLoading}
                >
                  {inquiryLoading ? "Submitting..." : "Submit Inquiry"}
                </button>
              </form>
            </div>
          )}

          <div className="chat-suggestions">

            <button
              onClick={() =>
                sendMessage(
                  "Tell me about Manimaran's experience"
                )
              }
            >
              Experience
            </button>

            <button
              onClick={() =>
                sendMessage(
                  "What technologies does Manimaran work with?"
                )
              }
            >
              Skills
            </button>

            <button
              onClick={() =>
                sendMessage(
                  "Tell me about Manimaran's automation experience"
                )
              }
            >
              Automation
            </button>

            <button
              onClick={() =>
                sendMessage(
                  "What services can Manimaran provide?"
                )
              }
            >
              Services
            </button>

            <button
              onClick={() => {
                setShowInquiryForm(true);
                setInquiryStatus("");
              }}
            >
              Hire Me
            </button>

          </div>

          <div className="chat-input-area">

            <input
              type="text"
              value={input}
              onChange={(event) =>
                setInput(event.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Ask about Manimaran..."
              disabled={loading}
            />

            <button
              onClick={() => sendMessage()}
              disabled={loading}
            >
              {loading ? "..." : "Send"}
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

export default App;