async function loadSkills() {
    const [categoriesRes, skillsRes] = await Promise.all([
        fetch('./data/categories.json'),
        fetch('./data/skills.json')
    ]);

    const categories = await categoriesRes.json();
    const skills = await skillsRes.json();

    const skillsSection = document.querySelector('#skills');

    // Repérer le bloc "Langues"
    const languageTitle = Array.from(skillsSection.querySelectorAll('h3'))
        .find(h3 => h3.textContent.trim().toLowerCase() === 'langues');

    // Supprimer toutes les sections entre <h1> et "Langues"
    let current = skillsSection.querySelector('h1').nextSibling;

    while (current && current !== languageTitle) {
        const next = current.nextSibling;
        skillsSection.removeChild(current);
        current = next;
    }

    // Point d'insertion = juste avant "Langues"
    const insertBeforeNode = languageTitle;

    categories.forEach(category => {
        const categorySkills = skills.filter(s => s.category === category.id);
        if (categorySkills.length === 0) return;

        // Titre catégorie
        const h3 = document.createElement('h3');
        h3.textContent = category.name;

        // Container badges
        const badgesDiv = document.createElement('div');
        badgesDiv.classList.add('badges');

        categorySkills.forEach(skill => {
            const badge = document.createElement('span');
            badge.classList.add('badge');

            const dot = document.createElement('span');
            dot.classList.add('dot');
            dot.style.background = skill.color;

            badge.appendChild(dot);
            badge.appendChild(document.createTextNode(skill.name));

            badgesDiv.appendChild(badge);
        });

        // Insertion propre avant "Langues"
        skillsSection.insertBefore(h3, insertBeforeNode);
        skillsSection.insertBefore(badgesDiv, insertBeforeNode);
        skillsSection.insertBefore(document.createElement('br'), insertBeforeNode);
    });
}

document.addEventListener('DOMContentLoaded', loadSkills);