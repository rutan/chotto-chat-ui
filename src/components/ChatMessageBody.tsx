import React from 'react';
import Markdown, { Components } from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ChatMessage, cx } from '../libs';
import { MdPerson, MdSmartToy } from 'react-icons/md';

export interface ChatGeneratingBodyProps {
  message: ChatMessage;
  children?: React.ReactNode;
}

const MarkdownComponents: Components = {
  h1: ({ node, ...props }) => <h1 className="text-4xl font-bold my-3" {...props} />,
  h2: ({ node, ...props }) => <h2 className="text-3xl font-bold my-3" {...props} />,
  h3: ({ node, ...props }) => <h3 className="text-2xl font-bold my-3" {...props} />,
  h4: ({ node, ...props }) => <h4 className="text-xl font-bold my-3" {...props} />,
  h5: ({ node, ...props }) => <h5 className="text-lg font-bold my-3" {...props} />,
  h6: ({ node, ...props }) => <h6 className="text-base font-bold my-3" {...props} />,
  p: ({ node, ...props }) => <p className="text-base my-3" {...props} />,
  code({ node, className, children }) {
    const match = /language-(\w+)/.exec(className || '');
    return (
      <SyntaxHighlighter language={match?.[1] ?? 'unknown'} style={dark} className="my-3">
        {String(children ?? '').replace(/\n$/, '')}
      </SyntaxHighlighter>
    );
  },
};

const remarkPlugins = [remarkBreaks];

export const ChatMessageBody = ({ message, children }: ChatGeneratingBodyProps) => {
  return (
    <div className="flex gap-2">
      <div className="flex flex-shrink-0 items-center justify-center w-12 h-12 bg-pane-weaker-bg rounded-full">
        {message.role === 'user' ? (
          <MdPerson className="w-8 h-8 m-auto" title="User" />
        ) : (
          <MdSmartToy className="w-8 h-8 m-auto" title="Robot" />
        )}
      </div>
      <div
        className={cx(message.role === 'user' ? 'bg-pane-success-bg' : 'bg-pane-bg', 'flex-grow p-2 rounded shadow-sm')}
      >
        <Markdown components={MarkdownComponents} remarkPlugins={remarkPlugins}>
          {message.content}
        </Markdown>
        {children}
      </div>
    </div>
  );
};
