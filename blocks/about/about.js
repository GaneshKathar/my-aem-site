export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 2) return;

  // First row: image column | text column
  const imageCol = rows[0].children[0];
  const textCol = rows[0].children[1];

  imageCol.classList.add('about-image');
  textCol.classList.add('about-content');

  // Process progress bars if second row exists (skill bars)
  if (rows[1]) {
    const skillsRow = rows[1];
    const skillItems = [...skillsRow.querySelectorAll('p')];
    const skillsContainer = document.createElement('div');
    skillsContainer.classList.add('about-skills');

    skillItems.forEach((item) => {
      const text = item.textContent.trim();
      // Expected format: "Skill Name 90%" or "Skill Name | 90%"
      const match = text.match(/^(.+?)\s+(\d+)%$/);
      if (match) {
        const skillName = match[1].replace('|', '').trim();
        const percent = parseInt(match[2], 10);

        const skill = document.createElement('div');
        skill.classList.add('about-skill');
        skill.innerHTML = `
          <div class="about-skill-header">
            <span class="about-skill-name">${skillName}</span>
            <span class="about-skill-percent">${percent}%</span>
          </div>
          <div class="about-skill-bar">
            <div class="about-skill-fill" style="--skill-width: ${percent}%"></div>
          </div>`;
        skillsContainer.append(skill);
      }
    });

    if (skillsContainer.children.length > 0) {
      textCol.append(skillsContainer);
      skillsRow.remove();
    }
  }

  // Animate skill bars when visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.about-skill-fill').forEach((fill) => {
          fill.style.width = fill.style.getPropertyValue('--skill-width');
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const skills = block.querySelector('.about-skills');
  if (skills) observer.observe(skills);
}
