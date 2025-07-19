import React from 'react';
import { useTheme } from '../store/useTheme';
import { THEMES } from '../constants/index';
import { Send } from 'lucide-react';

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going?", isSent: false },
  { id: 2, content: "I'm doing great! Just working on some new features.", isSent: true },
];

function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-base-100 text-base-content pt-24 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* Theme Selection */}
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold">Theme</h2>
            <p className="text-sm text-base-content/70">Choose a theme for your chat interface</p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-8 gap-3">
            {THEMES.map((t) => (
              <button
                key={t}
                className={`group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-all 
                border border-transparent ${theme === t ? "bg-base-200 border-primary" : "hover:bg-base-200/60"}`}
                onClick={() => setTheme(t)}
              >
                <div className="relative h-8 w-full rounded-md overflow-hidden shadow-sm" data-theme={t}>
                  <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                    <div className="rounded bg-primary"></div>
                    <div className="rounded bg-secondary"></div>
                    <div className="rounded bg-accent"></div>
                    <div className="rounded bg-neutral"></div>
                  </div>
                </div>
                <span className="text-[11px] font-medium truncate w-full text-center">
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Preview Section */}
        <section>
          <h3 className="text-2xl font-semibold mb-4">Preview</h3>
          <div className="rounded-xl border border-base-300 overflow-hidden shadow-lg bg-base-100">
            <div className="p-4 bg-base-200">
              <div className="max-w-md mx-auto bg-base-100 rounded-xl overflow-hidden shadow">

                {/* Header */}
                <div className="px-4 py-3 border-b border-base-300 bg-base-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-content flex items-center justify-center font-medium">J</div>
                  <div>
                    <h4 className="font-medium text-sm">John Doe</h4>
                    <p className="text-xs text-base-content/70">Online</p>
                  </div>
                </div>

                {/* Messages */}
                <div className="p-4 space-y-4 min-h-[200px] max-h-[200px] overflow-y-auto bg-base-100">
                  {PREVIEW_MESSAGES.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.isSent ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] rounded-xl px-4 py-2 text-sm shadow-sm
                        ${msg.isSent ? "bg-primary text-primary-content" : "bg-base-200 text-base-content"}`}
                      >
                        <p>{msg.content}</p>
                        <p className="text-[10px] mt-1 opacity-70">12:00 PM</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input */}
                <div className="p-4 border-t border-base-300 bg-base-100">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="input input-bordered flex-1 text-sm h-10"
                      value="This is a preview"
                      readOnly
                    />
                    <button className="btn btn-primary h-10 min-h-0 px-3">
                      <Send size={18} />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

export default SettingsPage;
