// Social sharing utilities

export function shareOnTwitter(url, text) {
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
  window.open(twitterUrl, '_blank', 'width=550,height=420');
}

export function shareOnFacebook(url) {
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  window.open(facebookUrl, '_blank', 'width=550,height=420');
}

export function shareOnLinkedIn(url, title, summary) {
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  window.open(linkedInUrl, '_blank', 'width=550,height=420');
}

export function shareViaEmail(url, subject, body) {
  const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body + '\n\n' + url)}`;
  window.location.href = mailtoUrl;
}

export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
}

export function shareNative(data) {
  if (navigator.share) {
    navigator.share(data).catch((err) => {
      console.error('Error sharing:', err);
    });
  } else {
    // Fallback to copy to clipboard
    copyToClipboard(data.url || data.text);
  }
}
