import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={cn('prose prose-sm max-w-none', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
        // 제목들
        h1: ({ children }) => (
          <h1 className="text-lg font-bold mb-2 text-gray-900">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-base font-bold mb-2 text-gray-900">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-sm font-bold mb-1 text-gray-900">{children}</h3>
        ),
        
        // 단락
        p: ({ children }) => (
          <p className="mb-2 last:mb-0 text-gray-900 leading-relaxed">{children}</p>
        ),
        
        // 목록들
        ul: ({ children }) => (
          <ul className="list-disc list-inside mb-2 space-y-1 text-gray-900">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside mb-2 space-y-1 text-gray-900">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="text-gray-900">{children}</li>
        ),
        
        // 강조
        strong: ({ children }) => (
          <strong className="font-bold text-gray-900">{children}</strong>
        ),
        em: ({ children }) => (
          <em className="italic text-gray-900">{children}</em>
        ),
        
        // 코드
        code: ({ inline, children }) => 
          inline ? (
            <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-xs font-mono">
              {children}
            </code>
          ) : (
            <pre className="bg-gray-100 text-gray-800 p-3 rounded-lg overflow-x-auto mb-2">
              <code className="text-xs font-mono">{children}</code>
            </pre>
          ),
        
        // 인용
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-green-200 pl-3 py-1 mb-2 text-gray-700 italic bg-green-50 rounded-r">
            {children}
          </blockquote>
        ),
        
        // 링크
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 underline hover:text-green-700"
          >
            {children}
          </a>
        ),
        
        // 구분선
        hr: () => <hr className="border-gray-200 my-3" />,
        
        // 테이블
        table: ({ children }) => (
          <div className="overflow-x-auto mb-2">
            <table className="min-w-full text-xs border-collapse">
              {children}
            </table>
          </div>
        ),
        th: ({ children }) => (
          <th className="border border-gray-200 bg-gray-50 px-2 py-1 text-left font-semibold text-gray-900">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border border-gray-200 px-2 py-1 text-gray-900">
            {children}
          </td>
        ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
  }
