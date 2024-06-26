async function fetchFreeCodeCampPosts() {
    const corsProxy = 'https://api.allorigins.win/raw?url=';
    const parser = new DOMParser();
    const response = await fetch(corsProxy + 'https://www.freecodecamp.org/news/author/larymak/rss/');
    const text = await response.text();
    const xmlDoc = parser.parseFromString(text, 'text/xml');
    const items = xmlDoc.getElementsByTagName('item');
    const posts = Array.from(items).map((item) => {
      return {
        title: item.querySelector('title').textContent,
        url: item.querySelector('link').textContent,
        description: item.querySelector('description').textContent,
        social_image: item.querySelector('media\\:content, content').getAttribute('url'),
        published_at: item.querySelector('pubDate').textContent,
      };
    });
    return posts;
  }

async function fetchDevToPosts() {
    const response = await fetch('https://dev.to/api/articles?username=larymak');
    const posts = await response.json();
    return posts;
  }

  async function displayPosts() {
	const devToPosts = await fetchDevToPosts();
	const freeCodeCampPosts = await fetchFreeCodeCampPosts();
  
	const posts = [...devToPosts, ...freeCodeCampPosts].sort((a, b) => new Date(b.published_at || b.created_at) - new Date(a.published_at || a.created_at));
  
	postsContainer.innerHTML = postsHTML;
  }

  displayPosts();