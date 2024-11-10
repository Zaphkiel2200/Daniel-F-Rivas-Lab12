class ContactManager {
    constructor() {
        this.contacts = [];
        this.loadContacts();
        this.setupEventListeners();
        this.currentImage = null;
    }

    loadContacts() {
        const savedContacts = localStorage.getItem('contacts');
        this.contacts = savedContacts ? JSON.parse(savedContacts) : [];
        this.renderContacts();
    }

    saveContacts() {
        localStorage.setItem('contacts', JSON.stringify(this.contacts));
    }

    addContact(contact) {
        contact.id = Date.now().toString();
        contact.image = this.currentImage;
        this.contacts.push(contact);
        this.saveContacts();
        this.renderContacts();
    }

    updateContact(id, updatedContact) {
        const index = this.contacts.findIndex(contact => contact.id === id);
        if (index !== -1) {
            this.contacts[index] = { ...this.contacts[index], ...updatedContact, image: this.currentImage || this.contacts[index].image };
            this.saveContacts();
            this.renderContacts();
        }
    }

    deleteContact(id) {
        this.contacts = this.contacts.filter(contact => contact.id !== id);
        this.saveContacts();
        this.renderContacts();
    }

    renderContacts(filteredContacts = this.contacts) {
        const contactsList = document.getElementById('contactsList');
        contactsList.innerHTML = '';
        filteredContacts.forEach(contact => {
            const contactCard = document.createElement('div');
            contactCard.className = 'contact-card';
            contactCard.innerHTML = `
                ${contact.image ? `<img src="${contact.image}" alt="Profile" class="profile-preview">` : ''}
                <h3>${contact.nombre}</h3>
                <p>Phone: ${contact.telefono}</p>
                <p>Email: ${contact.email}</p>
                <p>Address: ${contact.direccion}</p>
                <div class="contact-actions">
                    <button class="btn btn-primary" onclick="contactManager.editContact('${contact.id}')">Edit</button>
                    <button class="btn btn-danger" onclick="contactManager.deleteContact('${contact.id}')">Delete</button>
                </div>
            `;
            contactsList.appendChild(contactCard);
        });
    }

    setupEventListeners() {
        document.getElementById('searchInput').addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const filteredContacts = this.contacts.filter(contact =>
                contact.nombre.toLowerCase().includes(query) ||
                contact.telefono.includes(query)
            );
            this.renderContacts(filteredContacts);
        });

        document.getElementById('toggleDarkMode').addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
        });

        const profileImageInput = document.getElementById('profileImage');
        profileImageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.currentImage = e.target.result;
                    document.getElementById('profilePreview').innerHTML = `<img src="${this.currentImage}" alt="Profile">`;
                };
                reader.readAsDataURL(file);
            }
        });

        const form = document.getElementById('contactForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = {
                nombre: document.getElementById('nombre').value,
                telefono: document.getElementById('telefono').value,
                email: document.getElementById('email').value,
                direccion: document.getElementById('direccion').value
            };
            const contactId = document.getElementById('contactId').value;

            if (contactId) {
                this.updateContact(contactId, formData);
                document.getElementById('contactId').value = '';
            } else {
                this.addContact(formData);
            }
            form.reset();
            this.currentImage = null;
            document.getElementById('profilePreview').innerHTML = '';
        });

        window.addEventListener('DOMContentLoaded', () => {
            if (localStorage.getItem('theme') === 'dark') {
                document.body.classList.add('dark-mode');
            }
        });
    }

    editContact(id) {
        const contact = this.contacts.find(contact => contact.id === id);
        if (contact) {
            document.getElementById('nombre').value = contact.nombre;
            document.getElementById('telefono').value = contact.telefono;
            document.getElementById('email').value = contact.email;
            document.getElementById('direccion').value = contact.direccion;
            document.getElementById('contactId').value = contact.id;
            this.currentImage = contact.image || null;
            document.getElementById('profilePreview').innerHTML = contact.image ? `<img src="${contact.image}" alt="Profile">` : '';
        }
    }
}

const contactManager = new ContactManager();
