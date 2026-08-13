import PostCard from "../components/PostCard";
import "../assets/home.css";

const posts = [
  {
    id: 1,
    username: "kishan",
    name: "Kishan Tiwari",
    caption: "Building something new with VibeGram 🚀",
    likes: 24,
    comments: 5,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085"
  },
  {
    id: 2,
    username: "alex",
    name: "Alex Morgan",
    caption: "Beautiful day to build something amazing ✨",
    likes: 51,
    comments: 8,
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
  },
  {
    id: 3,
    username: "developer",
    name: "Dev Community",
    caption: "Code. Learn. Build. Repeat. 💻",
    likes: 37,
    comments: 12,
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4"
  }
];

function Home() {
  return (
    <div className="home-page">

      {/* Navbar */}
      <nav className="home-navbar">
        <div className="brand">
          <span>Vibe</span>Gram
        </div>

        <div className="nav-actions">
          <button>⌕</button>
          <button>♡</button>
          <button>👤</button>
        </div>
      </nav>

      {/* Main Feed */}
      <main className="feed-container">

        <div className="feed-header">
          <h2>Home</h2>
          <button className="create-post-btn">
            + Create Post
          </button>
        </div>

        {/* Posts */}
        <div className="posts-container">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
            />
          ))}
        </div>

      </main>

    </div>
  );
}

export default Home;