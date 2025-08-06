/*
 * scripts.js
 *
 * This file contains client‑side logic for comment submission,
 * forum thread handling and subscription state. All data is stored
 * in the browser's localStorage. While this approach doesn’t provide
 * true persistence across devices, it enables a simple commenting
 * experience on a static site without a backend. Only visitors
 * who have confirmed their subscription (via join.html) can post
 * comments or create threads.
 */

document.addEventListener('DOMContentLoaded', function () {
  /* Handle comment sections */
  const commentContainers = document.querySelectorAll('.comment-section');
  commentContainers.forEach(section => {
    const pageKey = section.dataset.page;
    const commentsKey = 'comments-' + pageKey;
    const commentsContainer = section.querySelector('.comments');
    const form = section.querySelector('form');
    const loginMsg = section.querySelector('.login-msg');
    let comments = [];
    try {
      comments = JSON.parse(localStorage.getItem(commentsKey)) || [];
    } catch (e) {
      comments = [];
    }
    // Render existing comments
    function renderComments() {
      commentsContainer.innerHTML = '';
      comments.forEach(com => {
        const div = document.createElement('div');
        div.className = 'comment';
        const p = document.createElement('p');
        p.textContent = com.text;
        const dateSpan = document.createElement('span');
        dateSpan.className = 'date';
        dateSpan.textContent = com.date;
        div.appendChild(p);
        div.appendChild(dateSpan);
        commentsContainer.appendChild(div);
      });
    }
    renderComments();
    // Check subscription status
    const subscribed = localStorage.getItem('newsletter_subscribed') === 'true';
    if (subscribed) {
      if (loginMsg) loginMsg.style.display = 'none';
      if (form) {
        form.style.display = 'block';
        form.addEventListener('submit', function (e) {
          e.preventDefault();
          const textField = form.querySelector('textarea[name="comment"]');
          const text = textField.value.trim();
          if (text) {
            const newComment = {
              text: text,
              date: new Date().toLocaleString()
            };
            comments.push(newComment);
            localStorage.setItem(commentsKey, JSON.stringify(comments));
            textField.value = '';
            renderComments();
          }
        });
      }
    } else {
      // Not subscribed: hide form and show login message
      if (form) form.style.display = 'none';
      if (loginMsg) loginMsg.style.display = 'block';
    }
  });

  /* Handle subscription confirmation button */
  const confirmBtn = document.getElementById('confirm-subscribe');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', function () {
      localStorage.setItem('newsletter_subscribed', 'true');
      alert('Thank you for subscribing! You can now participate in discussions.');
      // Refresh the page to update comment forms if necessary
      location.reload();
    });
  }

  /* Forum logic */
  const forumPage = document.getElementById('forum-page');
  if (forumPage) {
    const threadsContainer = document.getElementById('forum-threads');
    const newThreadForm = document.getElementById('new-thread-form');
    const forumLoginMsg = document.getElementById('forum-login-msg');
    let threads = [];
    try {
      threads = JSON.parse(localStorage.getItem('forumThreads')) || [];
    } catch (e) {
      threads = [];
    }
    function renderThreads() {
      threadsContainer.innerHTML = '';
      threads.forEach((thread, idx) => {
        const threadDiv = document.createElement('div');
        threadDiv.className = 'thread';
        const title = document.createElement('h4');
        title.textContent = thread.title;
        const content = document.createElement('p');
        content.textContent = thread.content;
        threadDiv.appendChild(title);
        threadDiv.appendChild(content);
        // Comments on thread
        const commentsDiv = document.createElement('div');
        commentsDiv.className = 'thread-comments';
        thread.comments.forEach(comment => {
          const comDiv = document.createElement('div');
          comDiv.className = 'comment';
          const comP = document.createElement('p');
          comP.textContent = comment.text;
          const comDate = document.createElement('span');
          comDate.className = 'date';
          comDate.textContent = comment.date;
          comDiv.appendChild(comP);
          comDiv.appendChild(comDate);
          commentsDiv.appendChild(comDiv);
        });
        threadDiv.appendChild(commentsDiv);
        // Reply form (only for subscribed users)
        const subscribed = localStorage.getItem('newsletter_subscribed') === 'true';
        if (subscribed) {
          const replyForm = document.createElement('form');
          replyForm.innerHTML = '<textarea name="reply" placeholder="Add a reply"></textarea>' +
            '<button type="submit" class="btn">Reply</button>';
          replyForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const replyText = replyForm.querySelector('textarea[name="reply"]').value.trim();
            if (replyText) {
              thread.comments.push({ text: replyText, date: new Date().toLocaleString() });
              localStorage.setItem('forumThreads', JSON.stringify(threads));
              renderThreads();
            }
          });
          threadDiv.appendChild(replyForm);
        }
        threadsContainer.appendChild(threadDiv);
      });
    }
    renderThreads();
    // New thread form
    const subscribedForum = localStorage.getItem('newsletter_subscribed') === 'true';
    if (subscribedForum) {
      if (forumLoginMsg) forumLoginMsg.style.display = 'none';
      newThreadForm.style.display = 'block';
      newThreadForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const titleField = newThreadForm.querySelector('input[name="title"]');
        const contentField = newThreadForm.querySelector('textarea[name="content"]');
        const title = titleField.value.trim();
        const content = contentField.value.trim();
        if (title && content) {
          threads.push({ title: title, content: content, comments: [] });
          localStorage.setItem('forumThreads', JSON.stringify(threads));
          titleField.value = '';
          contentField.value = '';
          renderThreads();
        }
      });
    } else {
      newThreadForm.style.display = 'none';
      if (forumLoginMsg) forumLoginMsg.style.display = 'block';
    }
  }
});