// ==================== PARTICLE EXTRACTOR ====================

function extractExamplesForParticle(particle, sprintIndex = null) {
  const examples = [];
  let sentencesToSearch = sentencesData;
  
  if (sprintIndex !== null && sprintIndex !== 'all') {
    const {start, end} = sprints[parseInt(sprintIndex)];
    sentencesToSearch = sentencesData.slice(start, end + 1);
  }
  
  sentencesToSearch.forEach((sentence) => {
    const pattern = new RegExp(`\\s${particle}\\s|^${particle}\\s|\\s${particle}$`);
    if (pattern.test(sentence.jp)) {
      examples.push(sentence);
    }
  });
  
  return examples.slice(0, 5);
}

function getSprintForSentence(sentence) {
  const index = sentencesData.findIndex(s => s === sentence);
  for (let i = 0; i < sprints.length; i++) {
    if (index >= sprints[i].start && index <= sprints[i].end) {
      return sprints[i].displayName;
    }
  }
  return "Unknown";
}

function getRandomSentenceWithParticle(particle, sprintIndex = null) {
  const examples = extractExamplesForParticle(particle, sprintIndex);
  if (examples.length === 0) return null;
  return examples[Math.floor(Math.random() * examples.length)];
}

function getAllSentencesWithParticle(particle, sprintIndex = null) {
  const examples = [];
  let sentencesToSearch = sentencesData;
  
  if (sprintIndex !== null && sprintIndex !== 'all') {
    const {start, end} = sprints[parseInt(sprintIndex)];
    sentencesToSearch = sentencesData.slice(start, end + 1);
  }
  
  sentencesToSearch.forEach((sentence) => {
    const pattern = new RegExp(`\\s${particle}\\s|^${particle}\\s|\\s${particle}$`);
    if (pattern.test(sentence.jp)) {
      examples.push(sentence);
    }
  });
  
  return examples;
}