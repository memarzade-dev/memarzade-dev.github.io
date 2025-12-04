---
layout: page
title: Archive
permalink: /archive/
---

# Full Archive of Posts

Browse through all my shared notes and posts, sorted by date. Use the search bar if your browser supports it, or dive in chronologically.

{% for post in paginator.posts %}
- [{{ post.title }}]({{ post.url | relative_url }}) – {{ post.date | date: "%B %d, %Y" }}  
  {{ post.excerpt | strip_html | truncatewords: 30 }}
{% endfor %}

## Pagination
{% if paginator.total_pages > 1 %}
  {% if paginator.previous_page %}
    <a href="{{ paginator.previous_page_path | relative_url }}">Previous</a>
  {% endif %}
  {% for page in (1..paginator.total_pages) %}
    {% if page == paginator.page %}
      <strong>{{ page }}</strong>
    {% elsif page == 1 %}
      <a href="{{ '/archive/' | relative_url }}">{{ page }}</a>
    {% else %}
      <a href="{{ site.paginate_path | relative_url | replace: ':num', page }}">{{ page }}</a>
    {% endif %}
  {% endfor %}
  {% if paginator.next_page %}
    <a href="{{ paginator.next_page_path | relative_url }}">Next</a>
  {% endif %}
{% endif %}