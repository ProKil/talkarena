import Link from "next/link"

export default {
    logo: <div className="flex items-center space-x-3"> 
    	<img src="/talkarena-logo.svg" alt="Logo" className="h-[20px]"/>
    	<span className="text-2xl font-bold">Talk Arena</span>
    </div>,
    project: {
      link: 'https://talkarena.org',
    },
    toc: {
      backToTop: true,
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
	      We appreciate the computing support provided by <a href="https://hai.stanford.edu/call-google-cloud-credit-proposals">Stanford HAI Google Cloud Credit Program</a>
	      
        </span>
      )
  },
    useNextSeoProps() {
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
    // ... other theme options
  }
