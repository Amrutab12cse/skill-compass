import streamlit as st
import random
import time
import urllib.parse
import plotly.express as px
import plotly.graph_objects as go

# --- PAGE CONFIGURATION ---
st.set_page_config(
    page_title="Skill Gap Analyzer — Find your next skill",
    page_icon="🧭",
    layout="wide",
    initial_sidebar_state="expanded"
)

# --- THEME & STYLING (GLASSMORPHISM & ACCENTS) ---
# We inject custom CSS to build a stunning, premium dark-mode interface.
st.markdown("""
<style>
    /* Google Fonts import */
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
    
    /* Global styles */
    html, body, [data-testid="stAppViewContainer"] {
        font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
        background-color: #0b0f19;
        color: #f1f5f9;
    }
    
    /* Sidebar styling */
    [data-testid="stSidebar"] {
        background-color: #080c14;
        border-right: 1px solid rgba(255, 255, 255, 0.05);
    }
    
    /* Header/Title Styles */
    h1, h2, h3, h4, h5, h6 {
        font-family: 'Outfit', sans-serif;
        color: #ffffff;
    }
    
    /* Custom Gradient Text */
    .text-gradient {
        background: linear-gradient(135deg, #a78bfa 0%, #6366f1 50%, #60a5fa 100%);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        color: transparent;
        font-weight: 800;
    }
    
    /* Glassmorphic Card Container */
    .glass-card {
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: 16px;
        padding: 24px;
        margin-bottom: 20px;
        box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        transition: all 0.3s ease;
    }
    
    .glass-card:hover {
        border-color: rgba(167, 139, 250, 0.2);
        box-shadow: 0 8px 32px 0 rgba(167, 139, 250, 0.05);
        transform: translateY(-2px);
    }

    /* Glowing Badge elements */
    .glow-tag {
        background: linear-gradient(135deg, rgba(124, 58, 237, 0.2) 0%, rgba(79, 70, 229, 0.2) 100%);
        border: 1px solid rgba(167, 139, 250, 0.3);
        box-shadow: 0 0 10px rgba(124, 58, 237, 0.1);
        border-radius: 9999px;
        padding: 4px 12px;
        font-size: 12px;
        color: #c084fc;
        font-weight: 600;
        display: inline-flex;
        align-items: center;
        margin-bottom: 12px;
    }

    /* Badge tags for skills */
    .skill-badge {
        display: inline-block;
        padding: 6px 14px;
        border-radius: 9999px;
        font-size: 13px;
        font-weight: 500;
        margin: 4px;
        background: rgba(255, 255, 255, 0.05);
        color: #e2e8f0;
        border: 1px solid rgba(255, 255, 255, 0.08);
        transition: all 0.2s ease;
    }
    .skill-badge-matched {
        background: rgba(16, 185, 129, 0.1);
        color: #34d399;
        border: 1px solid rgba(16, 185, 129, 0.25);
    }
    .skill-badge-missing {
        background: rgba(239, 68, 68, 0.1);
        color: #f87171;
        border: 1px solid rgba(239, 68, 68, 0.25);
    }
    
    /* Interactive poll bar */
    .poll-bar-container {
        width: 100%;
        background-color: rgba(255, 255, 255, 0.05);
        border-radius: 9999px;
        height: 8px;
        overflow: hidden;
        margin-top: 6px;
        margin-bottom: 12px;
    }
    .poll-bar-fill {
        height: 100%;
        background: linear-gradient(90deg, #7c3aed 0%, #4f46e5 100%);
        border-radius: 9999px;
    }
    
    /* Custom button styles */
    div.stButton > button {
        background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%) !important;
        color: white !important;
        border: none !important;
        border-radius: 10px !important;
        padding: 10px 24px !important;
        font-weight: 600 !important;
        font-family: 'Outfit', sans-serif !important;
        box-shadow: 0 4px 14px 0 rgba(124, 58, 237, 0.3) !important;
        transition: all 0.3s ease !important;
        width: auto;
    }
    div.stButton > button:hover {
        opacity: 0.9 !important;
        transform: translateY(-1px) !important;
        box-shadow: 0 6px 20px 0 rgba(124, 58, 237, 0.4) !important;
    }
    div.stButton > button:active {
        transform: translateY(1px) !important;
    }

    /* Floating layout background blobs */
    .mesh-blob-1 {
        position: absolute;
        width: 400px;
        height: 400px;
        background: radial-gradient(circle, rgba(124, 58, 237, 0.12) 0%, rgba(0,0,0,0) 70%);
        top: -100px;
        left: -100px;
        z-index: -10;
        pointer-events: none;
    }
    .mesh-blob-2 {
        position: absolute;
        width: 500px;
        height: 500px;
        background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, rgba(0,0,0,0) 70%);
        top: 200px;
        right: -150px;
        z-index: -10;
        pointer-events: none;
    }
    
    /* Resource Link items */
    .resource-link {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.05);
        margin-bottom: 8px;
        text-decoration: none;
        color: #e2e8f0;
        transition: all 0.2s ease;
    }
    .resource-link:hover {
        background: rgba(255, 255, 255, 0.06);
        border-color: rgba(167, 139, 250, 0.3);
        color: #ffffff;
    }
</style>
""", unsafe_allow_html=True)

# Render decorative background blobs
st.markdown('<div class="mesh-blob-1"></div><div class="mesh-blob-2"></div>', unsafe_allow_html=True)


# --- DATA DEFINITIONS ---
ROLES = [
  {
    "id": "frontend",
    "name": "Frontend Developer",
    "emoji": "🎨",
    "description": "Build beautiful, responsive user interfaces.",
    "skills": ["HTML", "CSS", "JavaScript", "React", "Git", "Responsive Design", "TypeScript", "Tailwind CSS"],
  },
  {
    "id": "backend",
    "name": "Backend Developer",
    "emoji": "⚙️",
    "description": "Design APIs, databases, and server logic.",
    "skills": ["Node.js", "Express", "SQL", "MongoDB", "REST APIs", "Git", "Docker", "Authentication"],
  },
  {
    "id": "fullstack",
    "name": "Full Stack Developer",
    "emoji": "🚀",
    "description": "End-to-end web development across the stack.",
    "skills": ["HTML", "CSS", "JavaScript", "React", "Node.js", "SQL", "Git", "REST APIs", "TypeScript"],
  },
  {
    "id": "data-scientist",
    "name": "Data Scientist",
    "emoji": "📊",
    "description": "Turn data into insights and models.",
    "skills": ["Python", "SQL", "Pandas", "NumPy", "Statistics", "Machine Learning", "Data Visualization", "Jupyter"],
  },
  {
    "id": "ai-ml",
    "name": "AI / ML Engineer",
    "emoji": "🤖",
    "description": "Build and deploy machine learning systems.",
    "skills": ["Python", "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "NLP", "Math", "MLOps"],
  },
  {
    "id": "cyber",
    "name": "Cybersecurity Analyst",
    "emoji": "🛡️",
    "description": "Protect systems, detect and respond to threats.",
    "skills": ["Networking", "Linux", "Cryptography", "SIEM", "Penetration Testing", "Risk Assessment", "Python", "Security Tools"],
  },
  {
    "id": "cloud",
    "name": "Cloud Engineer",
    "emoji": "☁️",
    "description": "Architect scalable cloud infrastructure.",
    "skills": ["AWS", "Azure", "Docker", "Kubernetes", "Terraform", "CI/CD", "Linux", "Networking"],
  },
]

LEARNING_SUGGESTIONS = {
  "react": [
    { "title": "React Official Tutorial", "resource": "react.dev", "url": "https://react.dev/learn" },
    { "title": "Build 5 React Projects", "resource": "freeCodeCamp", "url": "https://www.freecodecamp.org/news/tag/react/" },
  ],
  "javascript": [
    { "title": "JavaScript.info Modern Guide", "resource": "javascript.info", "url": "https://javascript.info/" },
    { "title": "MDN JS Reference", "resource": "MDN", "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
  ],
  "typescript": [
    { "title": "TypeScript Handbook", "resource": "typescriptlang.org", "url": "https://www.typescriptlang.org/docs/handbook/intro.html" },
  ],
  "python": [
    { "title": "Python for Everybody", "resource": "Coursera", "url": "https://www.coursera.org/specializations/python" },
    { "title": "Real Python Tutorials", "resource": "realpython.com", "url": "https://realpython.com/" },
  ],
  "sql": [
    { "title": "SQLBolt Interactive Lessons", "resource": "sqlbolt.com", "url": "https://sqlbolt.com/" },
    { "title": "Mode SQL Tutorial", "resource": "Mode", "url": "https://mode.com/sql-tutorial/" },
  ],
  "machine learning": [
    { "title": "Andrew Ng's ML Course", "resource": "Coursera", "url": "https://www.coursera.org/learn/machine-learning" },
    { "title": "Hands-On ML with Scikit-Learn", "resource": "Book", "url": "https://www.oreilly.com/library/view/hands-on-machine-learning/9781098125967/" },
  ],
  "tensorflow": [
    { "title": "TensorFlow Beginner Quickstart", "resource": "tensorflow.org", "url": "https://www.tensorflow.org/tutorials/quickstart/beginner" },
    { "title": "Deep Learning Specialization", "resource": "Coursera", "url": "https://www.coursera.org/specializations/deep-learning" },
  ],
  "pytorch": [
    { "title": "PyTorch 60-Minute Blitz", "resource": "pytorch.org", "url": "https://pytorch.org/tutorials/beginner/deep_learning_60min_blitz.html" },
  ],
  "deep learning": [
    { "title": "Deep Learning Specialization", "resource": "Coursera", "url": "https://www.coursera.org/specializations/deep-learning" },
  ],
  "docker": [
    { "title": "Docker Get Started", "resource": "docs.docker.com", "url": "https://docs.docker.com/get-started/" },
  ],
  "kubernetes": [
    { "title": "Kubernetes Basics", "resource": "kubernetes.io", "url": "https://kubernetes.io/docs/tutorials/kubernetes-basics/" },
  ],
  "aws": [
    { "title": "AWS Cloud Practitioner", "resource": "AWS Training", "url": "https://aws.amazon.com/training/learn-about/cloud-practitioner/" },
  ],
  "git": [
    { "title": "Pro Git Book", "resource": "git-scm.com", "url": "https://git-scm.com/book/en/v2" },
  ],
}

def get_default_suggestions(skill):
    return [
        {
            "title": f"Learn {skill} Fundamentals",
            "resource": "Search on YouTube",
            "url": f"https://www.youtube.com/results?search_query={urllib.parse.quote(skill + ' tutorial')}"
        },
        {
            "title": f"{skill} on freeCodeCamp",
            "resource": "freeCodeCamp",
            "url": f"https://www.freecodecamp.org/news/search/?query={urllib.parse.quote(skill)}"
        }
    ]

DUMMY_RESUME_SKILLS = ["Python", "React", "SQL", "Git", "JavaScript", "HTML", "CSS", "REST APIs"]


# --- SESSION STATE INITIALIZATION ---
if "user_skills" not in st.session_state:
    st.session_state.user_skills = []
if "target_role_id" not in st.session_state:
    st.session_state.target_role_id = ROLES[0]["id"]
if "analysis_result" not in st.session_state:
    st.session_state.analysis_result = None
if "logged_in" not in st.session_state:
    st.session_state.logged_in = False
if "username" not in st.session_state:
    st.session_state.username = ""
if "poll_votes" not in st.session_state:
    st.session_state.poll_votes = {
        "AI / LLMs": 412,
        "Rust": 187,
        "Kubernetes": 156,
        "TypeScript": 298
    }
if "voted_option" not in st.session_state:
    st.session_state.voted_option = None


# --- ANALYSIS UTILITY FUNCTION ---
def run_analysis(role_id, user_skills):
    role = next((r for r in ROLES if r["id"] == role_id), ROLES[0])
    required_skills = role["skills"]
    
    # Normalize comparison
    user_skills_set = {s.strip().lower() for s in user_skills}
    
    matching = [s for s in required_skills if s.strip().lower() in user_skills_set]
    missing = [s for s in required_skills if s.strip().lower() not in user_skills_set]
    
    match_percentage = 0
    if required_skills:
        match_percentage = int((len(matching) / len(required_skills)) * 100)
        
    strengths = []
    if not matching:
        strengths.append("Fresh start — every skill you add will count.")
    else:
        strengths.append(f"You already cover {len(matching)} of {len(required_skills)} core skills.")
        if len(matching) >= len(required_skills) / 2:
            strengths.append("Strong foundation for this role.")
        else:
            strengths.append("Solid starting point to build on.")
            
    weaknesses = []
    if not missing:
        weaknesses.append("No gaps detected. Consider advanced specializations.")
    else:
        weaknesses.append(f"{len(missing)} key skill{' is' if len(missing) == 1 else 's are'} missing for this role.")
        if len(missing) > len(required_skills) / 2:
            weaknesses.append("Focus on fundamentals first.")
        else:
            weaknesses.append("A few targeted topics will close the gap.")
            
    recommendations = []
    for skill in missing:
        items = LEARNING_SUGGESTIONS.get(skill.lower(), get_default_suggestions(skill))
        recommendations.append({
            "skill": skill,
            "items": items
        })
        
    result = {
        "role": role,
        "user_skills": user_skills,
        "matching": matching,
        "missing": missing,
        "match_percentage": match_percentage,
        "strengths": strengths,
        "weaknesses": weaknesses,
        "recommendations": recommendations
    }
    
    st.session_state.analysis_result = result
    return result


# --- NAVIGATION ROUTING ---
# Sidebar navigation configured to look premium
st.sidebar.markdown(
    '<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 24px;">'
    '<div style="height: 38px; width: 38px; border-radius: 10px; background: linear-gradient(135deg, #7c3aed, #4f46e5); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(124, 58, 237, 0.4);">'
    '<span style="font-size: 18px; color: white;">🧭</span>'
    '</div>'
    '<span style="font-size: 20px; font-weight: 700; color: white; font-family: Outfit;">SkillGap</span>'
    '</div>',
    unsafe_allow_html=True
)

if st.session_state.logged_in:
    st.sidebar.markdown(
        f'<div style="margin-bottom: 20px; padding: 12px; border-radius: 12px; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05);">'
        f'<span style="color: #94a3b8; font-size: 12px;">Logged in as</span><br/>'
        f'<strong style="color: #ffffff; font-size: 15px;">👋 {st.session_state.username or "Guest User"}</strong>'
        f'</div>',
        unsafe_allow_html=True
    )
    
    pages = ["Dashboard", "Skill Analysis", "Learning Plan", "Resume Upload", "Sign Out"]
else:
    pages = ["Welcome", "Sign In", "Try Demo Account"]

page_choice = st.sidebar.radio("Navigation", pages, label_visibility="collapsed")


# --- PAGE 1: WELCOME/LANDING PAGE ---
if page_choice == "Welcome":
    # Hero Header Section
    st.markdown('<div class="glow-tag">⚡ AI-powered skill insights</div>', unsafe_allow_html=True)
    st.markdown('<h1>Bridge your <span class="text-gradient">skill gap</span><br>to your dream role.</h1>', unsafe_allow_html=True)
    st.markdown(
        '<p style="font-size: 18px; color: #94a3b8; max-width: 700px; margin-top: 10px; margin-bottom: 30px;">'
        'Pick a career role, list your skills, and get an instant match score with a personalized learning roadmap — built with a clean, modern UI.'
        '</p>',
        unsafe_allow_html=True
    )
    
    if st.button("Start Analysis"):
        st.session_state.logged_in = True
        st.session_state.username = "Guest"
        st.rerun()
        
    st.write("---")
    
    # Mockup Glassmorphic Card
    st.markdown(
        '<div class="glass-card" style="max-width: 600px; margin: 40px auto 20px auto;">'
        '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">'
        '<div style="display: flex; align-items: center; gap: 8px;">'
        '<span style="font-size: 20px;">🤖</span>'
        '<strong style="font-size: 16px; color: white;">AI/ML Engineer Match</strong>'
        '</div>'
        '<span class="text-gradient" style="font-size: 24px; font-weight: 700;">62%</span>'
        '</div>'
        '<div class="poll-bar-container"><div class="poll-bar-fill" style="width: 62%;"></div></div>'
        '<div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 15px;">'
        '<span class="skill-badge skill-badge-matched">Python ✓</span>'
        '<span class="skill-badge skill-badge-matched">Machine Learning ✓</span>'
        '<span class="skill-badge skill-badge-missing">TensorFlow ✗</span>'
        '<span class="skill-badge skill-badge-missing">PyTorch ✗</span>'
        '</div>'
        '</div>',
        unsafe_allow_html=True
    )
    
    # Features grid
    st.markdown('<h3 style="text-align: center; margin-top: 60px;">Everything you need to grow</h3>', unsafe_allow_html=True)
    col1, col2, col3, col4 = st.columns(4)
    
    features = [
        {"icon": "🧠", "title": "Smart Matching", "desc": "Instantly compare your skills to a role's requirements."},
        {"icon": "📊", "title": "Visual Insights", "desc": "Charts, progress bars, and clear strengths/weaknesses."},
        {"icon": "🎓", "title": "Learning Plan", "desc": "Curated resources for every missing skill."},
        {"icon": "📁", "title": "Resume Parse", "desc": "Drop a resume and see extracted skills (demo)."}
    ]
    
    for col, feat in zip([col1, col2, col3, col4], features):
        with col:
            st.markdown(
                f'<div class="glass-card" style="height: 100%;">'
                f'<div style="height: 44px; width: 44px; border-radius: 12px; background: linear-gradient(135deg, #7c3aed, #4f46e5); display: flex; align-items: center; justify-content: center; margin-bottom: 16px;">'
                f'<span style="font-size: 20px; color: white;">{feat["icon"]}</span>'
                f'</div>'
                f'<h4 style="font-size: 16px; margin-bottom: 6px;">{feat["title"]}</h4>'
                f'<p style="font-size: 13px; color: #94a3b8; margin: 0;">{feat["desc"]}</p>'
                f'</div>',
                unsafe_allow_html=True
            )


# --- SIGN IN PAGES ---
elif page_choice == "Sign In":
    st.markdown('<h2>Sign In</h2>', unsafe_allow_html=True)
    st.markdown('<p style="color: #94a3b8;">Enter your name to customize your skill analysis session.</p>', unsafe_allow_html=True)
    
    name_input = st.text_input("Your Name", placeholder="e.g. Amruta")
    
    if st.button("Access Skill Compass"):
        if name_input.strip():
            st.session_state.logged_in = True
            st.session_state.username = name_input.strip()
            st.success(f"Welcome, {st.session_state.username}!")
            time.sleep(0.5)
            st.rerun()
        else:
            st.error("Please enter a name or click 'Try Demo Account' in the sidebar.")

elif page_choice == "Try Demo Account":
    st.session_state.logged_in = True
    st.session_state.username = "Guest Student"
    st.session_state.user_skills = ["Python", "HTML", "CSS", "Git", "SQL"]
    run_analysis("ai-ml", st.session_state.user_skills)
    st.success("Logged in with guest profile data!")
    time.sleep(0.5)
    st.rerun()

elif page_choice == "Sign Out":
    st.session_state.logged_in = False
    st.session_state.username = ""
    st.session_state.user_skills = []
    st.session_state.analysis_result = None
    st.success("Signed out successfully.")
    time.sleep(0.5)
    st.rerun()


# --- LOGGED IN ROUTING: DASHBOARD ---
elif page_choice == "Dashboard":
    st.markdown(
        f'<div class="glass-card">'
        f'<span style="color: #c084fc; font-size: 13px; font-weight: 600;">✨ Welcome back</span>'
        f'<h2 style="margin: 4px 0 0 0;">Hi {st.session_state.username or "Guest"} 👋</h2>'
        f'<p style="color: #94a3b8; margin-top: 4px; font-size: 14px;">Here\'s your skill journey at a glance.</p>'
        f'</div>',
        unsafe_allow_html=True
    )
    
    res = st.session_state.analysis_result
    
    # 3 Stat Cards Columns
    col1, col2, col3 = st.columns(3)
    
    with col1:
        match_val = f"{res['match_percentage']}%" if res else "—"
        sub_val = res['role']['name'] if res else "Run an analysis"
        st.markdown(
            f'<div class="glass-card" style="display: flex; justify-content: space-between; align-items: flex-start;">'
            f'<div>'
            f'<span style="color: #94a3b8; font-size: 11px; text-transform: uppercase; tracking-wider: 1px;">Match Percentage</span>'
            f'<h2 style="font-size: 32px; margin: 8px 0 2px 0; color: #a78bfa;">{match_val}</h2>'
            f'<span style="color: #94a3b8; font-size: 12px;">{sub_val}</span>'
            f'</div>'
            f'<div style="height: 40px; width: 40px; border-radius: 8px; background: rgba(167, 139, 250, 0.1); display: flex; align-items: center; justify-content: center; border: 1px solid rgba(167, 139, 250, 0.2);">'
            f'<span style="font-size: 18px;">🎯</span>'
            f'</div>'
            f'</div>',
            unsafe_allow_html=True
        )
        
    with col2:
        missing_val = str(len(res['missing'])) if res else "—"
        sub_val = "Identified gaps" if res else "No data yet"
        st.markdown(
            f'<div class="glass-card" style="display: flex; justify-content: space-between; align-items: flex-start;">'
            f'<div>'
            f'<span style="color: #94a3b8; font-size: 11px; text-transform: uppercase; tracking-wider: 1px;">Missing Skills</span>'
            f'<h2 style="font-size: 32px; margin: 8px 0 2px 0; color: #f87171;">{missing_val}</h2>'
            f'<span style="color: #94a3b8; font-size: 12px;">{sub_val}</span>'
            f'</div>'
            f'<div style="height: 40px; width: 40px; border-radius: 8px; background: rgba(248, 113, 113, 0.1); display: flex; align-items: center; justify-content: center; border: 1px solid rgba(248, 113, 113, 0.2);">'
            f'<span style="font-size: 18px;">⚠️</span>'
            f'</div>'
            f'</div>',
            unsafe_allow_html=True
        )
        
    with col3:
        rec_count = sum(len(rec['items']) for rec in res['recommendations']) if res else 0
        rec_val = str(rec_count) if res else "—"
        st.markdown(
            f'<div class="glass-card" style="display: flex; justify-content: space-between; align-items: flex-start;">'
            f'<div>'
            f'<span style="color: #94a3b8; font-size: 11px; text-transform: uppercase; tracking-wider: 1px;">Learning Guides</span>'
            f'<h2 style="font-size: 32px; margin: 8px 0 2px 0; color: #34d399;">{rec_val}</h2>'
            f'<span style="color: #94a3b8; font-size: 12px;">Curated resources</span>'
            f'</div>'
            f'<div style="height: 40px; width: 40px; border-radius: 8px; background: rgba(52, 211, 153, 0.1); display: flex; align-items: center; justify-content: center; border: 1px solid rgba(52, 211, 153, 0.2);">'
            f'<span style="font-size: 18px;">🎓</span>'
            f'</div>'
            f'</div>',
            unsafe_allow_html=True
        )

    # Main Grid (Chart + Poll)
    left_col, right_col = st.columns(2)
    
    with left_col:
        st.markdown(
            '<div class="glass-card" style="min-height: 380px;">'
            '<h3 style="font-size: 18px; margin-bottom: 4px;">📈 Skill Coverage</h3>'
            '<p style="color: #94a3b8; font-size: 12px; margin-bottom: 20px;">Matched vs missing skills ratio</p>',
            unsafe_allow_html=True
        )
        
        if res and len(res["role"]["skills"]) > 0:
            labels = ['Matched Skills', 'Missing Skills']
            values = [len(res['matching']), len(res['missing'])]
            
            # Create Plotly Pie Chart
            fig = go.Figure(data=[go.Pie(
                labels=labels,
                values=values,
                hole=.6,
                marker=dict(colors=['#10b981', 'rgba(239, 68, 68, 0.35)']),
                textinfo='label+percent',
                textfont=dict(color='#ffffff')
            )])
            
            fig.update_layout(
                paper_bgcolor='rgba(0,0,0,0)',
                plot_bgcolor='rgba(0,0,0,0)',
                showlegend=False,
                margin=dict(t=10, b=10, l=10, r=10),
                height=240,
            )
            
            st.plotly_chart(fig, use_container_width=True, config={'displayModeBar': False})
        else:
            st.markdown(
                '<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 240px; text-align: center; color: #94a3b8;">'
                '<span style="font-size: 40px; opacity: 0.4; margin-bottom: 10px;">🎯</span>'
                '<p style="font-size: 14px;">Run your first analysis to see the chart.</p>'
                '</div>',
                unsafe_allow_html=True
            )
            
        st.markdown('</div>', unsafe_allow_html=True)
        
    with right_col:
        st.markdown(
            '<div class="glass-card" style="min-height: 380px;">'
            '<h3 style="font-size: 18px; margin-bottom: 4px;">📊 Community Poll</h3>'
            '<p style="color: #94a3b8; font-size: 13px; margin-bottom: 20px;">Which skill should I learn next in 2026?</p>',
            unsafe_allow_html=True
        )
        
        total_votes = sum(st.session_state.poll_votes.values())
        
        for option, votes in st.session_state.poll_votes.items():
            pct = int((votes / total_votes) * 100) if total_votes else 0
            is_voted = (st.session_state.voted_option == option)
            voted_indicator = " ✓" if is_voted else ""
            
            # Streamlit columns to hold buttons and text nicely
            col_opt, col_pct = st.columns([4, 1])
            with col_opt:
                if st.session_state.voted_option is None:
                    if st.button(option, key=f"poll_{option}"):
                        st.session_state.poll_votes[option] += 1
                        st.session_state.voted_option = option
                        st.rerun()
                else:
                    st.markdown(f'<span style="font-size: 14px; {"color: #a78bfa; font-weight: 600;" if is_voted else "color: #e2e8f0;"}">{option}{voted_indicator}</span>', unsafe_allow_html=True)
            with col_pct:
                st.markdown(f'<span style="float: right; color: #94a3b8; font-size: 13px;">{pct}% ({votes})</span>', unsafe_allow_html=True)
                
            # Progress bar
            st.markdown(f'<div class="poll-bar-container"><div class="poll-bar-fill" style="width: {pct}%; {"background: linear-gradient(90deg, #10b981, #059669);" if is_voted else ""}"></div></div>', unsafe_allow_html=True)
            
        if st.session_state.voted_option:
            st.markdown('<p style="color: #34d399; font-size: 12px; margin-top: 10px;">Thanks for voting! 🎉</p>', unsafe_allow_html=True)
            
        st.markdown('</div>', unsafe_allow_html=True)


# --- LOGGED IN ROUTING: SKILL ANALYSIS ---
elif page_choice == "Skill Analysis":
    st.markdown('<h2 style="margin-bottom: 4px;">🧭 Skill Gap Analysis</h2>', unsafe_allow_html=True)
    st.markdown('<p style="color: #94a3b8; font-size: 14px; margin-bottom: 24px;">Select your desired career path and audit your skills to find resources.</p>', unsafe_allow_html=True)
    
    # Configuration Layout
    st.markdown('<div class="glass-card">', unsafe_allow_html=True)
    col_l, col_r = st.columns(2)
    
    with col_l:
        role_options = [r["name"] for r in ROLES]
        # Find current index
        selected_role_obj = next((r for r in ROLES if r["id"] == st.session_state.target_role_id), ROLES[0])
        idx = role_options.index(selected_role_obj["name"])
        
        selected_role_name = st.selectbox("Target Career Role", role_options, index=idx)
        current_role = next(r for r in ROLES if r["name"] == selected_role_name)
        st.session_state.target_role_id = current_role["id"]
        
        st.markdown(f'<p style="color: #94a3b8; font-size: 13px; margin-top: 12px;"><i>{current_role["description"]}</i></p>', unsafe_allow_html=True)
        
        # Display required skills
        st.markdown('<div style="margin-top: 14px;"><strong style="font-size: 12px; color: #94a3b8; text-transform: uppercase;">Required Core Skills:</strong></div>', unsafe_allow_html=True)
        badges_html = "".join([f'<span class="skill-badge">{s}</span>' for s in current_role["skills"]])
        st.markdown(f'<div style="margin-top: 6px;">{badges_html}</div>', unsafe_allow_html=True)
        
    with col_r:
        # Skills input
        # Standard input and list representation
        st.markdown('<label style="font-size: 14px; font-weight: 500;">Add Your Current Skills</label>', unsafe_allow_html=True)
        new_skill_input = st.text_input("Type skill and press Enter (or separate by comma)", placeholder="e.g. Python, SQL, Git", key="add_skill_input")
        
        if new_skill_input:
            parts = [s.strip() for s in new_skill_input.split(",") if s.strip()]
            for part in parts:
                if part not in st.session_state.user_skills:
                    st.session_state.user_skills.append(part)
            st.rerun()
            
        # Display current skills
        st.markdown('<div style="margin-top: 14px;"><strong style="font-size: 12px; color: #94a3b8; text-transform: uppercase;">Your Skills (Click "x" inside sidebar to manage or clear):</strong></div>', unsafe_allow_html=True)
        if not st.session_state.user_skills:
            st.markdown('<p style="font-size: 13px; color: #f87171; margin-top: 6px;">No skills added yet.</p>', unsafe_allow_html=True)
        else:
            user_badges_html = "".join([f'<span class="skill-badge skill-badge-matched">{s}</span>' for s in st.session_state.user_skills])
            st.markdown(f'<div style="margin-top: 6px;">{user_badges_html}</div>', unsafe_allow_html=True)
            
            if st.button("Clear All Skills"):
                st.session_state.user_skills = []
                st.session_state.analysis_result = None
                st.rerun()
                
    st.write("")
    if st.button("Run Analysis", use_container_width=True):
        if not st.session_state.user_skills:
            st.error("Please add at least one skill first.")
        else:
            with st.spinner("Crunching numbers..."):
                time.sleep(1.0)
                run_analysis(st.session_state.target_role_id, st.session_state.user_skills)
                st.success("Analysis complete!")
                
    st.markdown('</div>', unsafe_allow_html=True)
    
    # Results Section
    res = st.session_state.analysis_result
    if res:
        st.markdown('<div class="glass-card">', unsafe_allow_html=True)
        col_res1, col_res2 = st.columns([1, 1])
        
        with col_res1:
            st.markdown(
                f'<span style="color: #94a3b8; font-size: 13px;">Skill match for {res["role"]["emoji"]} {res["role"]["name"]}</span>'
                f'<h2 style="font-size: 48px; margin: 4px 0;" class="text-gradient">{res["match_percentage"]}%</h2>'
                f'<p style="font-size: 14px; color: #e2e8f0;">{len(res["matching"])} matched · {len(res["missing"])} missing out of {len(res["role"]["skills"])} skills</p>',
                unsafe_allow_html=True
            )
            # Match progress bar
            st.markdown(
                f'<div class="poll-bar-container"><div class="poll-bar-fill" style="width: {res["match_percentage"]}%;"></div></div>',
                unsafe_allow_html=True
            )
            
        with col_res2:
            # Interactive Bar Chart of skills
            # X values: Skill names, Y values: 1 for have, 0.2 for missing (for visualization)
            chart_skills = res["role"]["skills"]
            have_y = [1 if s in res["matching"] else 0.15 for s in chart_skills]
            colors = ['#10b981' if s in res["matching"] else '#ef4444' for s in chart_skills]
            
            fig = go.Figure(data=[go.Bar(
                x=chart_skills,
                y=have_y,
                marker_color=colors,
                hovertext=["Status: Matched" if s in res["matching"] else "Status: Missing" for s in chart_skills]
            )])
            
            fig.update_layout(
                paper_bgcolor='rgba(0,0,0,0)',
                plot_bgcolor='rgba(0,0,0,0)',
                xaxis=dict(
                    tickfont=dict(color='#94a3b8', size=11),
                    gridcolor='rgba(255,255,255,0.05)',
                    title=None
                ),
                yaxis=dict(
                    showgrid=False,
                    showticklabels=False,
                    range=[0, 1.2],
                    title=None
                ),
                height=180,
                margin=dict(t=10, b=10, l=10, r=10)
            )
            
            st.plotly_chart(fig, use_container_width=True, config={'displayModeBar': False})
            
        # Strengths / Weaknesses Grid
        col_st, col_wk = st.columns(2)
        with col_st:
            st.markdown(
                '<div style="padding: 16px; border-radius: 12px; background: rgba(16, 185, 129, 0.05); border: 1px solid rgba(16, 185, 129, 0.15); height: 100%;">'
                '<strong style="color: #34d399; font-size: 15px; display: flex; align-items: center; gap: 6px;">'
                '<span>✓</span> Strengths'
                '</strong>',
                unsafe_allow_html=True
            )
            for strength in res["strengths"]:
                st.markdown(f'<div style="font-size: 13px; color: #e2e8f0; margin-top: 6px;">• {strength}</div>', unsafe_allow_html=True)
            
            strength_badges = "".join([f'<span class="skill-badge skill-badge-matched" style="margin-top: 12px;">{s}</span>' for s in res["matching"]])
            st.markdown(f'<div style="margin-top: 10px;">{strength_badges}</div></div>', unsafe_allow_html=True)
            
        with col_wk:
            st.markdown(
                '<div style="padding: 16px; border-radius: 12px; background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.15); height: 100%;">'
                '<strong style="color: #f87171; font-size: 15px; display: flex; align-items: center; gap: 6px;">'
                '<span>⚠️</span> Weaknesses / Gaps'
                '</strong>',
                unsafe_allow_html=True
            )
            for weakness in res["weaknesses"]:
                st.markdown(f'<div style="font-size: 13px; color: #e2e8f0; margin-top: 6px;">• {weakness}</div>', unsafe_allow_html=True)
            
            weakness_badges = "".join([f'<span class="skill-badge skill-badge-missing" style="margin-top: 12px;">{s}</span>' for s in res["missing"]])
            st.markdown(f'<div style="margin-top: 10px;">{weakness_badges}</div></div>', unsafe_allow_html=True)
            
        st.write("")
        st.markdown('</div>', unsafe_allow_html=True)


# --- LOGGED IN ROUTING: LEARNING RECOMMENDATIONS ---
elif page_choice == "Learning Plan":
    res = st.session_state.analysis_result
    
    if not res:
        st.markdown(
            '<div class="glass-card" style="text-align: center; padding: 40px;">'
            '<span style="font-size: 48px;">🎓</span>'
            '<h3 style="margin-top: 12px;">No recommendations yet</h3>'
            '<p style="color: #94a3b8; font-size: 14px;">Run an analysis first to generate a personalized learning plan.</p>'
            '</div>',
            unsafe_allow_html=True
        )
    else:
        st.markdown('<div class="glass-card">', unsafe_allow_html=True)
        st.markdown(
            f'<span style="color: #94a3b8; font-size: 13px;">Learning plan for</span>'
            f'<h2 style="margin: 4px 0;">{res["role"]["emoji"]} {res["role"]["name"]}</h2>',
            unsafe_allow_html=True
        )
        if len(res["missing"]) == 0:
            st.markdown('<p style="color: #34d399; font-size: 14px; margin-top: 8px;">🎉 You already cover all required skills. Explore advanced topics next.</p>', unsafe_allow_html=True)
        else:
            st.markdown(f'<p style="color: #94a3b8; font-size: 14px; margin-top: 8px;">Focus on these {len(res["missing"])} skills to close the gap.</p>', unsafe_allow_html=True)
        st.markdown('</div>', unsafe_allow_html=True)
        
        # Suggestions Grid
        if len(res["recommendations"]) > 0:
            cols = st.columns(2)
            for idx, rec in enumerate(res["recommendations"]):
                col_i = cols[idx % 2]
                with col_i:
                    st.markdown(
                        f'<div class="glass-card">'
                        f'<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">'
                        f'<div>'
                        f'<span style="font-size: 11px; text-transform: uppercase; color: #94a3b8;">Skill to learn</span>'
                        f'<h3 style="font-size: 18px; margin: 2px 0;">{rec["skill"]}</h3>'
                        f'</div>'
                        f'<div style="height: 36px; width: 36px; border-radius: 8px; background: linear-gradient(135deg, #7c3aed, #4f46e5); display: flex; align-items: center; justify-content: center;">'
                        f'<span style="font-size: 16px;">📖</span>'
                        f'</div>'
                        f'</div>',
                        unsafe_allow_html=True
                    )
                    
                    for item in rec["items"]:
                        st.markdown(
                            f'<a href="{item["url"]}" target="_blank" class="resource-link">'
                            f'<div>'
                            f'<div style="font-size: 14px; font-weight: 600; color: #ffffff;">{item["title"]}</div>'
                            f'<div style="font-size: 11px; color: #94a3b8;">{item["resource"]}</div>'
                            f'</div>'
                            f'<span style="font-size: 14px; color: #a78bfa;">↗</span>'
                            f'</a>',
                            unsafe_allow_html=True
                        )
                    st.markdown('</div>', unsafe_allow_html=True)


# --- LOGGED IN ROUTING: RESUME UPLOAD ---
elif page_choice == "Resume Upload":
    st.markdown('<h2 style="margin-bottom: 4px;">📁 Upload Your Resume</h2>', unsafe_allow_html=True)
    st.markdown('<p style="color: #94a3b8; font-size: 14px; margin-bottom: 24px;">Upload your resume (PDF, TXT, DOCX) and we will automatically extract your skills to add to your profile.</p>', unsafe_allow_html=True)
    
    st.markdown('<div class="glass-card">', unsafe_allow_html=True)
    
    uploaded_file = st.file_uploader("Upload Resume File", type=["pdf", "txt", "docx", "doc"])
    
    if uploaded_file is not None:
        st.markdown(
            f'<div style="padding: 12px; border-radius: 8px; background: rgba(52, 211, 153, 0.05); border: 1px solid rgba(52, 211, 153, 0.15); margin-top: 10px; display: flex; align-items: center; gap: 8px;">'
            f'<span style="color: #34d399;">✓</span>'
            f'<span style="font-size: 14px; color: #e2e8f0;">File uploaded: <b>{uploaded_file.name}</b> ({uploaded_file.size/1024:.1f} KB)</span>'
            f'</div>',
            unsafe_allow_html=True
        )
        
        # State key for extraction trigger
        extract_key = f"extracted_{uploaded_file.name}"
        if extract_key not in st.session_state:
            with st.spinner("Parsing resume contents..."):
                time.sleep(1.2)
                # Randomize mock skills subset
                num_skills = random.randint(4, 7)
                extracted_skills = random.sample(DUMMY_RESUME_SKILLS, num_skills)
                st.session_state[extract_key] = extracted_skills
                
        extracted_skills = st.session_state[extract_key]
        
        st.markdown('<h3 style="font-size: 16px; margin-top: 24px;">Extracted Skills Detected:</h3>', unsafe_allow_html=True)
        extracted_badges = "".join([f'<span class="skill-badge skill-badge-matched">{s}</span>' for s in extracted_skills])
        st.markdown(f'<div style="margin-top: 6px;">{extracted_badges}</div>', unsafe_allow_html=True)
        
        st.write("")
        if st.button("Add Extracted Skills to Profile"):
            added = 0
            for skill in extracted_skills:
                if skill not in st.session_state.user_skills:
                    st.session_state.user_skills.append(skill)
                    added += 1
            st.success(f"Added {added} new skills to your profile! Current skills: {len(st.session_state.user_skills)}")
            # Rerun analysis automatically
            run_analysis(st.session_state.target_role_id, st.session_state.user_skills)
            time.sleep(0.8)
            
    else:
        st.markdown(
            '<div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 160px; border: 2px dashed rgba(255, 255, 255, 0.15); border-radius: 12px; margin-top: 10px; color: #94a3b8;">'
            '<span style="font-size: 32px; margin-bottom: 8px;">📤</span>'
            '<p style="font-size: 14px; margin: 0;">Drag & drop your file above, or browse to select.</p>'
            '</div>',
            unsafe_allow_html=True
        )
        
    st.markdown('</div>', unsafe_allow_html=True)

# Footer info
st.write("---")
st.markdown('<div style="text-align: center; font-size: 12px; color: #64748b; margin-top: 20px;">SkillGap Analyzer · Built with Streamlit, Plotly & Custom CSS Theme</div>', unsafe_allow_html=True)
