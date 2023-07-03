const getYtEmbedLink = (link: string): string | undefined => {
  if (!link) {
    return;
  }

  const youtubeIdRegex =
    /^(?:(?:https|http):\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be).*?(?:\/|v\/|u\/|embed\/|shorts\/|watch\?v=|(?<username>user\/))(?<id>[\w-]{11})(?:\?|&|$)/;

  const match = link.match(youtubeIdRegex);

  // checks if 'user/' is located right before expected id, in which case it would return username instead
  if (match?.groups?.username || !match?.groups?.id) {
    return;
  }

  return `https://www.youtube.com/embed/${match.groups.id}`;
};

export default getYtEmbedLink;
