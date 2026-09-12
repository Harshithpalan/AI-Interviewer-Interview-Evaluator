export interface InterviewQuestion {
  id: number;
  question: string;
  category: string;
  followUp?: string;
}

export interface InterviewSession {
  id: string;
  role: string;
  date: string;
  messages: ChatMessage[];
  evaluation?: EvaluationResult;
}

export interface ChatMessage {
  id: string;
  role: "ai" | "user";
  content: string;
  timestamp: number;
}

export interface EvaluationResult {
  overallScore: number;
  categories: {
    name: string;
    score: number;
    feedback: string;
  }[];
  summary: string;
  strengths: string[];
  improvements: string[];
}

export const ROLE_QUESTIONS: Record<string, InterviewQuestion[]> = {
  "Software Engineer": [
    { id: 1, question: "Tell me about yourself and your experience with software engineering.", category: "Introduction", followUp: "What projects are you most proud of?" },
    { id: 2, question: "Can you explain the difference between object-oriented and functional programming?", category: "Technical Knowledge" },
    { id: 3, question: "How do you approach debugging a complex issue in production?", category: "Problem Solving" },
    { id: 4, question: "Describe a time when you had to work with a difficult team member. How did you handle it?", category: "Behavioral" },
    { id: 5, question: "What design patterns do you use most often and why?", category: "Technical Knowledge" },
    { id: 6, question: "How do you ensure code quality in your projects?", category: "Best Practices" },
    { id: 7, question: "Tell me about a challenging technical problem you solved recently.", category: "Problem Solving" },
    { id: 8, question: "How do you stay updated with new technologies and industry trends?", category: "Growth Mindset" },
  ],
  "Product Manager": [
    { id: 1, question: "Walk me through your product management experience.", category: "Introduction" },
    { id: 2, question: "How do you prioritize features in a product roadmap?", category: "Strategy" },
    { id: 3, question: "Describe a time when you had to say no to a stakeholder's request.", category: "Stakeholder Management" },
    { id: 4, question: "How do you gather and incorporate user feedback into your product?", category: "User Research" },
    { id: 5, question: "Tell me about a product launch that didn't go as planned. What did you learn?", category: "Problem Solving" },
    { id: 6, question: "How do you measure the success of a product feature?", category: "Analytics" },
    { id: 7, question: "How do you balance business goals with user needs?", category: "Strategy" },
    { id: 8, question: "Describe your process for defining product requirements.", category: "Execution" },
  ],
  "Data Scientist": [
    { id: 1, question: "Tell me about your background in data science.", category: "Introduction" },
    { id: 2, question: "How do you handle missing data in a dataset?", category: "Technical Knowledge" },
    { id: 3, question: "Explain the difference between supervised and unsupervised learning.", category: "Technical Knowledge" },
    { id: 4, question: "How do you validate a machine learning model?", category: "Methodology" },
    { id: 5, question: "Describe a project where your analysis led to a significant business impact.", category: "Impact" },
    { id: 6, question: "How do you communicate technical findings to non-technical stakeholders?", category: "Communication" },
    { id: 7, question: "What's your approach to feature engineering?", category: "Technical Knowledge" },
    { id: 8, question: "How do you handle imbalanced datasets?", category: "Technical Knowledge" },
  ],
  "UX Designer": [
    { id: 1, question: "Tell me about your design background and philosophy.", category: "Introduction" },
    { id: 2, question: "Walk me through your design process for a new feature.", category: "Process" },
    { id: 3, question: "How do you conduct user research?", category: "Research" },
    { id: 4, question: "Describe a time when user research changed your initial design direction.", category: "Adaptability" },
    { id: 5, question: "How do you handle design feedback from developers?", category: "Collaboration" },
    { id: 6, question: "What tools do you use for prototyping and why?", category: "Tools" },
    { id: 7, question: "How do you ensure accessibility in your designs?", category: "Best Practices" },
    { id: 8, question: "Tell me about a design you're particularly proud of.", category: "Portfolio" },
  ],
  "DevOps Engineer": [
    { id: 1, question: "Tell me about your DevOps experience and philosophy.", category: "Introduction" },
    { id: 2, question: "How do you approach CI/CD pipeline design?", category: "Technical Knowledge" },
    { id: 3, question: "Describe your experience with infrastructure as code.", category: "Technical Knowledge" },
    { id: 4, question: "How do you handle a production outage? Walk me through your process.", category: "Incident Management" },
    { id: 5, question: "What monitoring and observability tools do you prefer?", category: "Tools" },
    { id: 6, question: "How do you implement security best practices in a DevOps workflow?", category: "Security" },
    { id: 7, question: "Describe a time you optimized infrastructure for cost or performance.", category: "Optimization" },
    { id: 8, question: "How do you manage secrets and configuration across environments?", category: "Best Practices" },
  ],
  "Marketing Lead": [
    { id: 1, question: "Tell me about your marketing experience and approach.", category: "Introduction" },
    { id: 2, question: "How do you develop a marketing strategy for a new product?", category: "Strategy" },
    { id: 3, question: "Describe a campaign that exceeded expectations. What made it successful?", category: "Execution" },
    { id: 4, question: "How do you measure marketing ROI?", category: "Analytics" },
    { id: 5, question: "How do you approach content marketing?", category: "Content" },
    { id: 6, question: "Tell me about a time a campaign didn't perform as expected.", category: "Problem Solving" },
    { id: 7, question: "How do you manage a marketing budget?", category: "Budget" },
    { id: 8, question: "How do you stay ahead of marketing trends?", category: "Growth Mindset" },
  ],
};

export function generateAIResponse(messages: ChatMessage[], role: string): string {
  const questionCount = messages.filter(m => m.role === "ai").length;
  const questions = ROLE_QUESTIONS[role] || ROLE_QUESTIONS["Software Engineer"];

  if (questionCount === 0) {
    return `Welcome! I'm your AI interviewer for the ${role} position. Let's begin with a quick introduction. ${questions[0].question}`;
  }

  const lastUserMessage = messages[messages.length - 1];
  const wordCount = lastUserMessage.content.split(" ").length;

  const encouragements = [
    "Thank you for that response. ",
    "Great, let me follow up on that. ",
    "Interesting perspective. ",
    "I appreciate your answer. ",
  ];

  const encouragement = encouragements[Math.floor(Math.random() * encouragements.length)];

  if (questionCount <= questions.length) {
    const nextQ = questions[Math.min(questionCount - 1, questions.length - 1)];
    if (wordCount < 15 && questionCount > 1) {
      return `${encouragement}Could you elaborate more on that? ${nextQ.followUp || nextQ.question}`;
    }
    return `${encouragement}${nextQ.question}`;
  }

  return `${encouragement}Thank you for answering all my questions. I'll now evaluate your performance across several categories. You can head to the evaluation page to see your detailed results.`;
}

export function evaluateSession(messages: ChatMessage[]): EvaluationResult {
  const userMessages = messages.filter(m => m.role === "user");
  const avgLength = userMessages.reduce((sum, m) => sum + m.content.split(" ").length, 0) / Math.max(userMessages.length, 1);

  const baseScore = Math.min(70 + avgLength * 0.5, 95);
  const variance = () => (Math.random() - 0.5) * 10;

  const categories = [
    {
      name: "Communication Skills",
      score: Math.round(Math.min(100, Math.max(40, baseScore + variance() + (avgLength > 30 ? 5 : 0)))),
      feedback: avgLength > 30
        ? "Excellent verbal communication. Your responses are detailed and well-structured."
        : "Consider providing more detailed responses with specific examples.",
    },
    {
      name: "Technical Knowledge",
      score: Math.round(Math.min(100, Math.max(40, baseScore + variance()))),
      feedback: "Demonstrates solid understanding of core concepts. Could dive deeper into specific technologies.",
    },
    {
      name: "Problem Solving",
      score: Math.round(Math.min(100, Math.max(40, baseScore + variance()))),
      feedback: "Shows logical thinking approach. Consider using more structured frameworks like STAR method.",
    },
    {
      name: "Cultural Fit",
      score: Math.round(Math.min(100, Math.max(40, baseScore + variance() + 5))),
      feedback: "Responses align well with collaborative team values. Great emphasis on teamwork.",
    },
    {
      name: "Confidence & Poise",
      score: Math.round(Math.min(100, Math.max(40, baseScore + variance() + (avgLength > 20 ? 3 : -3)))),
      feedback: avgLength > 20
        ? "Projects confidence through articulate and thorough responses."
        : "Try to be more expressive and detailed to convey confidence.",
    },
  ];

  const overallScore = Math.round(categories.reduce((sum, c) => sum + c.score, 0) / categories.length);

  const strengths = [
    "Strong communication and articulation",
    "Good understanding of core concepts",
    "Professional demeanor",
  ];
  const improvements = [
    "Provide more specific examples from past experience",
    "Use structured answer formats (STAR, CAR)",
    "Include more metrics and quantifiable results",
  ];

  if (avgLength > 30) strengths.push("Detailed and comprehensive responses");
  if (avgLength < 20) improvements.push("Elaborate more on answers with concrete examples");

  return {
    overallScore,
    categories,
    summary: `You performed ${overallScore >= 80 ? "excellently" : overallScore >= 60 ? "well" : "adequately"} in this ${userMessages.length}-question interview. Your communication skills are ${overallScore >= 70 ? "strong" : "developing"}, and you demonstrated ${overallScore >= 65 ? "solid" : "basic"} technical knowledge.`,
    strengths,
    improvements,
  };
}
