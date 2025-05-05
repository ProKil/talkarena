import Link from "next/link"
import { useRouter } from 'next/router'

export default {
    logo: <div className="flex items-center"> 
    	<img src="/talkarena-logo.svg" alt="Logo" style={{width: '3rem'}}/>
    	<span className="text-2xl font-bold">Talk Arena</span>
    </div>,
    project: {
      link: 'https://github.com/SALT-NLP/talk-arena/',
    },
    toc: {
      backToTop: true,
      float: false
      
    },
    sidebar: {
      toggleButton: true,
    },
    search: {
      placeholder: 'Search contents',
    },
    feedback: {
        content: null,
    },
    head: (
      <>
        <link rel="icon" href="/awesome-social-agents/favicon.ico" type="image/ico" />
        <link rel="icon" href="/awesome-social-agents/favicon.svg" type="image/svg" />
      </>
    ),
    footer: {
      text: (
        <span>
          CC-BY (SA) 4.0 &copy; 2024 <a href="https://talkarena.org">Talk Arena</a>
          <br />
        </span>
      )
    },
  useNextSeoProps() {
      const { asPath } = useRouter()
      if (asPath && asPath.includes('cava')) {
	return {
          titleTemplate: 'Talk Arena',
          description: '',
          openGraph: {
            type: 'website',
            images: [
              {
                url: 'https://talkarena.org/cava_preview.png',
              }
            ],
            locale: 'en_US',
            url: 'https://talkarena.org/cava',
            siteName: 'Comprehensive Assessment for Voice Assistants',
            title: 'Comprehensive Assessment for Voice Assistants',
            description: 'CAVA is a new benchmark for assessing how well Large Audio Models support voice assistant capabilities.',
          },
          twitter: {
            cardType: 'summary_large_image',
            title: 'CAVA Benchmark',
            image: 'https://talkarena.org/cava_preview.png',
          },
	}
      }
      return {
        titleTemplate: 'Talk Arena',
        description: '',
        openGraph: {
            type: 'website',
            images: [
              {
                url: 'https://talkarena.org/preview.png',
              }
            ],
            locale: 'en_US',
            url: 'https://talkarena.org',
            siteName: 'Talk Arena',
            title: 'Talk Arena',
            description: 'Interactive evaluation for audio models',
        },
        twitter: {
            cardType: 'summary_large_image',
            title: 'Talk Arena',
            image: 'https://talkarena.org/preview.png',
        },
      }
    },
    darkMode: false,
    nextThemes: {
      forcedTheme: 'light'
    }
}
