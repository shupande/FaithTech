import React from 'react'
import { FooterNav } from './footer-nav'

export function Footer() {
  return (
    <footer className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <FooterNav />
        
        <div className="mt-8 border-t border-gray-200 pt-8 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">TikTok</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">YouTube</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.5 6.2c-.3-1-1.1-1.8-2.1-2.1C19.4 3.6 12 3.6 12 3.6s-7.4 0-9.4.5c-1 .3-1.8 1.1-2.1 2.1C0 8.2 0 12 0 12s0 3.8.5 5.8c.3 1 1.1 1.8 2.1 2.1 2 .5 9.4.5 9.4.5s7.4 0 9.4-.5c1-.3 1.8-1.1 2.1-2.1.5-2 .5-5.8.5-5.8s0-3.8-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z"/>
              </svg>
            </a>
            <a
              href="https://wa.me/your-number"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">WhatsApp</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.5 2h-11C4 2 2 4 2 6.5v11C2 20 4 22 6.5 22h11c2.5 0 4.5-2 4.5-4.5v-11C22 4 20 2 17.5 2zm-1.7 15.3c-.3.8-1.3 1.4-2.1 1.6-.6.1-1.3.2-3.8-.8-3.2-1.3-5.2-4.4-5.4-4.6-.2-.2-1.4-1.9-1.4-3.6s.9-2.5 1.2-2.9c.3-.3.6-.4.9-.4h.6c.2 0 .5 0 .7.5.3.7 1 2.3 1.1 2.4.1.2.1.4 0 .6-.1.2-.2.3-.3.5-.2.2-.3.3-.5.5-.2.2-.4.4-.2.7.2.4.9 1.6 2 2.6 1.4 1.3 2.6 1.7 3 1.9.3.1.5.1.7-.1.2-.2.9-1 1.1-1.4.2-.3.5-.3.8-.2.3.1 2 .9 2.3 1.1.3.2.6.3.7.4.1.3.1.9-.2 1.7z"/>
              </svg>
            </a>
            <a
              href="mailto:your-email@example.com"
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Email</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
            </a>
            <a
              href="spotify:user:your-profile"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Spotify</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm5.5 17.3c-.2.3-.6.4-.9.2-2.5-1.5-5.6-1.9-9.2-1-1.1.2-1.4-.8-.3-1 4-.9 7.4-.5 10.2 1.2.3.2.4.6.2.9zm1.5-3.3c-.3.4-.8.5-1.2.3-2.8-1.7-7.1-2.2-10.4-1.2-.4.1-.8-.1-1-.5-.1-.4.1-.8.5-1 3.8-1.1 8.5-.6 11.7 1.3.4.2.5.7.3 1.1zm.1-3.4C15.9 8.8 9.2 8.6 5.4 9.8c-.5.1-1-.2-1.1-.6-.1-.5.2-1 .6-1.1C9.3 6.7 16.7 7 21 9.1c.5.2.7.8.5 1.2-.2.4-.8.6-1.3.4z"/>
              </svg>
            </a>
            <a
              href="weixin://dl/chat?your-id"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">WeChat</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.5 13.5c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm7 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.5 3.5c0-4.4-4.5-8-10-8s-10 3.6-10 8c0 2.1 1 4 2.7 5.4.2.2.3.4.3.7v1.3c0 .4.4.7.8.6l1.5-.5c.3-.1.5 0 .8.1.9.3 1.9.4 2.9.4 5.5 0 10-3.6 10-8z"/>
              </svg>
            </a>
          </div>
          
          <div className="text-gray-400 text-sm">
            © {new Date().getFullYear()} FaithTech. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
} 