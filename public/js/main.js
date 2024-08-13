document.addEventListener('DOMContentLoaded', () => {
    const pageList = document.getElementById('pageList');
    const navMenu = document.getElementById('navMenu');
    const createPageForm = document.getElementById('createPageForm');
    const editPageForm = document.getElementById('editPageForm');
    
    const fetchPages = async () => {
        const res = await fetch('/api/pages');
        const pages = await res.json();
        return pages;
    };
    
    const renderPages = async () => {
        const pages = await fetchPages();
        
      if (pageList) {
            pageList.innerHTML = '';
            pages.forEach(page => {
                const li = document.createElement('li');
                li.innerHTML = `
                    ${page.title} - 
                    <a href="edit.html?id=${page._id}">Edit</a>
                `;
                pageList.appendChild(li);
            });
        }
        
     
        

    
        pages.forEach(page => {
            const a = document.createElement('a');
            a.href = `index.html?id=${page._id}`; 
            a.textContent = page.title;
            navMenu.appendChild(a);
        });
    }
    
    const createPage = async (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const slug = document.getElementById
        ('slug').value;
        const content = document.getElementById('content').value;
        const image = document.getElementById('image').value;

        const res = await fetch('/api/pages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, slug, content, image }),
        });

        if (res.ok) {
            window.location.href = 'admin.html';
        } else {
            alert('Failed to create page');
        }
    };

    const loadPageForEdit = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        console.log(id);
        if (!id) return;

        const res = await fetch(`/api/getpages/${id}`);
        const page = await res.json();

        document.getElementById('editTitle').value = page.title;
        document.getElementById('editSlug').value = page.slug;
        document.getElementById('editContent').value = page.content;
        document.getElementById('editImage').value = page.image;
    };

    const editPage = async (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        const title = document.getElementById('editTitle').value;
        const slug = document.getElementById('editSlug').value;
        const content = document.getElementById('editContent').value;
        const image = document.getElementById('editImage').value;

        const res = await fetch(`/api/pages/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, slug, content, image }),
        });

        if (res.ok) {
            window.location.href = 'admin.html';
        } else {
            alert('Failed to update page');
        }
    };

    const deletePage = async (id) => {
        if (confirm('Are you sure you want to delete this page?')) {
            const res = await fetch(`/api/pages/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                renderPages();
            } else {
                alert('Failed to delete page');
            }
        }
    };

    if (createPageForm) {
        createPageForm.addEventListener('submit', createPage);
    }

    if (editPageForm) {
        editPageForm.addEventListener('submit', editPage);
        loadPageForEdit();
    }

    renderPages();
});



