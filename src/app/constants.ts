interface Link {
  name: string,
  url: string,
  icon: string,
  description: string
}

export const links: Link[] = [
  {
    name: 'SkyeDownloader',
    url: '/downloader',
    icon: 'download',
    description: 'Download media from Twitter, Youtube, Reddit and many other websites.'
  },
  {
    name: 'SkyeConverter',
    url: '/converter',
    icon: 'sync',
    description: 'Convert between different file formats.'
  },
  {
    name: 'SkyeTV',
    url: '/tv',
    icon: 'live_tv',
    description: 'Watch films and movies online (not made by me, only self-hosting).'
  },
]
