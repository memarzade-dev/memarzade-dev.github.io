import { Calendar, Tag, ArrowLeft, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { ErrorMessage } from '../components/ErrorMessage';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { SEO } from '../components/SEO';
import { ShareButtons } from '../components/ShareButtons';
import { TableOfContents } from '../components/TableOfContents';
import { parseFrontMatter } from '@/utils/frontMatter';

const files = import.meta.glob('../data/posts/*.md', { query: '?raw', import: 'default', eager: true });

interface BlogPostData {
  title: string;
  description: string;
  date: string;
  readTime: number;
  tags: string[];
  content: string;
  author: {
    name: string;
    avatar?: string;
  };
}

// Sample blog posts data - In a real app, this would come from an API or CMS
const _blogPosts: Record<string, BlogPostData> = {
  'laravel-scalable-apps': {
    title: 'Building Scalable Web Applications with Laravel',
    description: 'Exploring best practices for creating maintainable and scalable Laravel applications with modern architecture patterns.',
    date: '2024-12-01',
    readTime: 8,
    tags: ['Laravel', 'PHP', 'Architecture'],
    author: {
      name: 'Ali Memarzade',
    },
    content: `# Building Scalable Web Applications with Laravel

Laravel has become one of the most popular PHP frameworks for building modern web applications. In this comprehensive guide, we'll explore best practices and architectural patterns that will help you create maintainable, scalable applications.

## Why Scalability Matters

Scalability isn't just about handling more users—it's about building a system that can grow with your business needs without requiring a complete rewrite.

### Key Principles

1. **Separation of Concerns**: Keep your business logic separate from your framework code
2. **Dependency Injection**: Use Laravel's service container effectively
3. **Caching Strategy**: Implement intelligent caching at multiple levels
4. **Database Optimization**: Use indexing, eager loading, and query optimization

## Architecture Patterns

### Repository Pattern

The repository pattern provides an abstraction layer between your business logic and data access logic:

\`\`\`php
interface UserRepositoryInterface
{
    public function find(int $id): ?User;
    public function create(array $data): User;
    public function update(int $id, array $data): bool;
}

class EloquentUserRepository implements UserRepositoryInterface
{
    public function find(int $id): ?User
    {
        return User::find($id);
    }
    
    public function create(array $data): User
    {
        return User::create($data);
    }
    
    public function update(int $id, array $data): bool
    {
        return User::where('id', $id)->update($data);
    }
}
\`\`\`

### Service Layer Pattern

Service classes encapsulate your business logic:

\`\`\`php
class UserRegistrationService
{
    public function __construct(
        private UserRepositoryInterface $userRepository,
        private EmailService $emailService,
        private EventDispatcher $eventDispatcher
    ) {}
    
    public function register(array $data): User
    {
        DB::beginTransaction();
        
        try {
            $user = $this->userRepository->create($data);
            $this->emailService->sendWelcomeEmail($user);
            $this->eventDispatcher->dispatch(new UserRegistered($user));
            
            DB::commit();
            return $user;
        } catch (\\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
\`\`\`

## Performance Optimization

### Query Optimization

Always be mindful of the N+1 query problem:

\`\`\`php
// Bad - N+1 queries
$users = User::all();
foreach ($users as $user) {
    echo $user->posts->count();
}

// Good - Eager loading
$users = User::withCount('posts')->get();
foreach ($users as $user) {
    echo $user->posts_count;
}
\`\`\`

### Caching Strategy

Implement multi-level caching:

\`\`\`php
public function getPopularPosts(): Collection
{
    return Cache::remember('popular_posts', 3600, function () {
        return Post::with('author')
            ->where('published', true)
            ->orderBy('views', 'desc')
            ->limit(10)
            ->get();
    });
}
\`\`\`

## Queue Management

Use queues for time-consuming tasks:

\`\`\`php
// Job class
class ProcessVideoUpload implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    
    public function __construct(
        private Video $video
    ) {}
    
    public function handle(): void
    {
        // Process video encoding
        $this->video->process();
    }
}

// Dispatch the job
ProcessVideoUpload::dispatch($video);
\`\`\`

## Testing Strategy

Write tests for critical business logic:

\`\`\`php
class UserRegistrationTest extends TestCase
{
    public function test_user_can_register_with_valid_data()
    {
        $data = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123'
        ];
        
        $response = $this->post('/api/register', $data);
        
        $response->assertStatus(201);
        $this->assertDatabaseHas('users', [
            'email' => 'john@example.com'
        ]);
    }
}
\`\`\`

## Conclusion

Building scalable Laravel applications requires careful planning and adherence to best practices. By implementing these patterns and strategies, you'll create applications that can grow with your business needs while remaining maintainable and performant.

Remember: **premature optimization is the root of all evil**. Start with clean architecture and optimize based on real-world metrics.

## Further Reading

- [Laravel Documentation](https://laravel.com/docs)
- [Domain-Driven Design in Laravel](https://example.com)
- [Laravel Performance Best Practices](https://example.com)

---

*Have questions or suggestions? Feel free to reach out in the comments below!*`,
  },
  'ai-code-generation': {
    title: 'AI-Powered Development: Using LLMs for Code Generation',
    description: 'How Large Language Models are transforming the way we write code and boost developer productivity.',
    date: '2024-11-28',
    readTime: 12,
    tags: ['AI', 'Python', 'LLM'],
    author: {
      name: 'Ali Memarzade',
    },
    content: `# AI-Powered Development: Using LLMs for Code Generation

Large Language Models (LLMs) are revolutionizing software development. In this article, we'll explore how to leverage AI for code generation and boost your productivity.

## The AI Revolution in Coding

AI-powered coding assistants like GitHub Copilot, ChatGPT, and Claude are changing how we write code. But understanding how to use them effectively is key.

### Benefits of AI-Assisted Development

- **Faster prototyping**: Generate boilerplate code instantly
- **Learning tool**: Discover new patterns and best practices
- **Documentation**: Generate comprehensive documentation
- **Bug detection**: Identify potential issues early

## Practical Use Cases

### 1. API Integration

Generate API client code quickly:

\`\`\`python
import openai
import os

openai.api_key = os.getenv("OPENAI_API_KEY")

def generate_code_with_ai(prompt: str) -> str:
    """Use GPT-4 to generate code based on a prompt."""
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {
                "role": "system",
                "content": "You are a helpful coding assistant."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.7,
        max_tokens=1000
    )
    
    return response.choices[0].message.content

# Example usage
prompt = "Create a Python function to fetch weather data from OpenWeatherMap API"
generated_code = generate_code_with_ai(prompt)
print(generated_code)
\`\`\`

### 2. Test Generation

Automatically generate unit tests:

\`\`\`python
def generate_tests_for_function(function_code: str) -> str:
    """Generate unit tests for a given function."""
    prompt = f"""
    Generate comprehensive unit tests for this function:
    
    {function_code}
    
    Include edge cases and use pytest framework.
    """
    
    return generate_code_with_ai(prompt)
\`\`\`

### 3. Code Review Assistant

\`\`\`python
def review_code(code: str) -> dict:
    """Get AI-powered code review suggestions."""
    prompt = f"""
    Review this code and provide:
    1. Potential bugs
    2. Performance improvements
    3. Security concerns
    4. Best practice violations
    
    Code:
    {code}
    """
    
    review = generate_code_with_ai(prompt)
    return parse_review(review)
\`\`\`

## Best Practices

### 1. Verify AI-Generated Code

> **Always review and test AI-generated code before using it in production.**

### 2. Provide Context

Give the AI detailed context for better results:

\`\`\`python
# Good prompt
"Create a Python function that validates email addresses using regex, 
handles unicode characters, and returns True/False. Include docstring 
and type hints."

# Bad prompt
"make email validator"
\`\`\`

### 3. Iterative Refinement

Use AI in an iterative process:

1. Generate initial code
2. Review and test
3. Refine with specific feedback
4. Repeat until satisfied

## Building an AI-Powered Code Assistant

Here's a complete example of a code generation tool:

\`\`\`python
from typing import Optional, List
import anthropic

class CodeAssistant:
    def __init__(self, api_key: str):
        self.client = anthropic.Anthropic(api_key=api_key)
        
    def generate(
        self,
        task: str,
        language: str = "python",
        context: Optional[str] = None
    ) -> str:
        """Generate code for a specific task."""
        prompt = self._build_prompt(task, language, context)
        
        message = self.client.messages.create(
            model="claude-3-opus-20240229",
            max_tokens=2000,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        
        return self._extract_code(message.content)
    
    def _build_prompt(self, task: str, language: str, context: Optional[str]) -> str:
        base = f"Generate {language} code for: {task}"
        if context:
            base += f"\\n\\nContext:\\n{context}"
        return base
    
    def _extract_code(self, response: str) -> str:
        # Extract code from markdown code blocks
        if "\`\`\`" in response:
            return response.split("\`\`\`")[1].split("\`\`\`")[0].strip()
        return response

# Usage
assistant = CodeAssistant(api_key="your-api-key")
code = assistant.generate(
    task="Create a REST API endpoint for user registration",
    language="python",
    context="Using FastAPI framework with SQLAlchemy"
)
print(code)
\`\`\`

## Limitations and Considerations

### Security Concerns

- Don't include sensitive data in prompts
- Review generated code for vulnerabilities
- Be cautious with database queries and user input handling

### Quality Assurance

- AI can hallucinate APIs or libraries that don't exist
- Generated code may not follow your project's conventions
- Performance may not be optimal

## The Future of AI in Development

AI coding assistants will continue to evolve, but they won't replace developers. Instead, they'll:

1. **Augment creativity**: Free developers from mundane tasks
2. **Democratize coding**: Lower barriers to entry
3. **Improve quality**: Catch bugs and suggest improvements
4. **Accelerate learning**: Help developers learn new technologies faster

## Conclusion

AI-powered code generation is a powerful tool that can significantly boost productivity. Use it wisely, always review generated code, and focus on using it to enhance—not replace—your development skills.

---

*What's your experience with AI coding assistants? Share your thoughts in the comments!*`,
  },
};

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState<string | null>(null);
  const [meta, setMeta] = useState<{ title?: string; description?: string; date?: string; tags?: string[]; readTime?: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call
    const fetchPost = async () => {
      setLoading(true);
      setError(null);

      try {
        await new Promise(resolve => setTimeout(resolve, 200));
        if (!slug) {
          setError('Blog post not found');
        } else {
          const entry = Object.entries(files).find(([path]) => {
            const name = path.split('/').pop()!.replace('.md', '');
            return name === slug;
          });
          if (entry) {
            const raw = entry[1] as string;
            const { data, body } = parseFrontMatter(raw);
            setContent(body);
            const titleMatch = body.match(/^#\s+(.+)$/m);
            const description = body.split('\n').find((l) => l.trim() && !l.startsWith('#')) || '';
            const tags = (data.tags || '').split(',').map((t) => t.trim()).filter(Boolean);
            const words = body.split(/\s+/).length;
            const readTime = Math.max(1, Math.round(words / 200));
            setMeta({
              title: data.title || (titleMatch ? titleMatch[1] : slug),
              description: data.description || description,
              date: data.date,
              tags,
              readTime,
            });
          } else {
            setError('Blog post not found');
          }
        }
      } catch (err) {
        setError('Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
    window.scrollTo(0, 0);
  }, [slug]);


  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage
          message={error || 'Post not found'}
          onRetry={() => navigate('/blog')}
          fullScreen
        />
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`${meta?.title || 'Blog'} | Memarzade.Dev`}
        description={meta?.description || ''}
        type="article"
        url={typeof window !== 'undefined' ? window.location.href : undefined}
      />

      <article className="py-12 bg-[rgb(var(--color-bg-base))]">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back Button */}
          <motion.button
            onClick={() => navigate('/blog')}
            className="flex items-center gap-2 text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-primary))] mb-8 transition-colors"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Blog
          </motion.button>
        </div>
      </article>

      {/* Table of Contents */}
      {content && <TableOfContents content={content} />}

      <article className="py-8 bg-[rgb(var(--color-bg-base))]">
        <div className="container mx-auto px-4 max-w-4xl">
          {meta?.date || meta?.tags || meta?.readTime ? (
            <div className="mb-6 flex flex-wrap gap-4 text-[rgb(var(--color-text-muted))]">
              {meta?.date && (
                <span className="inline-flex items-center gap-2"><Calendar className="w-4 h-4" />{new Date(meta.date).toLocaleDateString()}</span>
              )}
              {meta?.tags && meta.tags.length > 0 && (
                <span className="inline-flex items-center gap-2"><Tag className="w-4 h-4" />{meta.tags.join(', ')}</span>
              )}
              {typeof meta?.readTime === 'number' && (
                <span className="inline-flex items-center gap-2"><Clock className="w-4 h-4" />{meta.readTime} min read</span>
              )}
            </div>
          ) : null}
          {content && <MarkdownRenderer content={content} />}
        </div>
      </article>

      <ShareButtons
        url={typeof window !== 'undefined' ? window.location.href : `https://memarzade-dev.memarzade-dev.workers.dev/blog/${slug}`}
        title={meta?.title || 'Memarzade.Dev - Blog'}
        description={meta?.description || `Article: ${slug}`}
      />
    </>
  );
}
