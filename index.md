---
layout: home
title: Welcome to My Vault
permalink: /
---

# Welcome to My Professional Digital Garden

Hey, glad you're here! This is my corner of the web where I transform my Obsidian Markdown notes into a living, breathing blog. Think of it as a interconnected web of ideas – from storytelling tips and AI explorations to casual learnings and creative brainstorms. Everything's organized, searchable, and styled in a clean dark theme for that late-night reading vibe.

Whether you're here for inspiration, writing advice, or just to poke around, dive in. Links weave through notes like a graph of thoughts, making it easy to jump from one idea to the next.

## Featured Insights
Explore hand-picked highlights from my vault:
- **AI in Storytelling**: How generative tools are reshaping narratives. [Read more](/ai-storytelling)
- **Brainstorming Hacks**: Quick tips for unlocking creativity. [Read more](/brainstorming-hacks)
- **Casual Learning Series**: Bite-sized lessons on communication and beyond. [Read more](/casual-learning)

## Recent Posts
Stay up-to-date with my latest additions:
{% for post in site.posts limit:5 %}
- [{{ post.title }}]({{ post.url }}) – {{ post.date | date: "%B %d, %Y" }}  
  {{ post.excerpt | strip_html | truncatewords: 20 }}
{% endfor %}

[See All Posts](/archive)

## About This Space
Built with love for knowledge sharing. If you're into natural conversations, hit me up – let's chat about ideas! Powered by Jekyll on GitHub Pages, with Obsidian handling the backend magic.

[Learn More About Me](/about) | [Get in Touch](/contact) | [View the Knowledge Graph](/graph)  # Add graph page if implemented