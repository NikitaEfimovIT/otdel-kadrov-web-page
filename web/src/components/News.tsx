import { ArrowRight } from "lucide-react";
import { TAG_LABELS } from "../lib/types";
import type { NewsPost } from "../lib/types";

export function News({ posts }: { posts: NewsPost[] }) {
  return (
    <section id="news" className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="eyebrow">
              <span className="eyebrow__diamond" />
              <span className="eyebrow__label">Что нового</span>
            </div>
            <h2 className="h2">Новости</h2>
          </div>
          <a href="#news" className="btn btn-ghost btn--sm">
            Все новости
            <ArrowRight size={16} />
          </a>
        </div>
        <div className="grid-3">
          {posts.map((p) => (
            <a key={p.id} href="#news" className="news-card hover-accent">
              <div className="news-card__meta">
                <span className="news-card__date">{p.date}</span>
                <span className="tag">{TAG_LABELS[p.tag].toUpperCase()}</span>
              </div>
              <h3 className="news-card__title">{p.title}</h3>
              <p className="news-card__excerpt">{p.excerpt}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
