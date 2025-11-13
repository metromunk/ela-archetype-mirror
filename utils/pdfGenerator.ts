
import { PdfReportPayload } from '../types';

// This function assumes pdfmake is loaded globally from index.html
declare const pdfMake: any;

export const generateArchetypePdf = (payload: PdfReportPayload) => {
  const {
    userName,
    archetypeResult,
    primaryArchetype,
    secondaryArchetype,
    pairingInsight,
    dateGenerated
  } = payload;

  const docDefinition = {
    info: {
      title: "ELA Archetype Mirror Report",
      author: "Metro Munk",
      subject: "Archetype Insight Report",
      keywords: "Archetype, ELA, Somatic Psych, Shadow Work"
    },

    content: [
      { text: "The ELA Archetype Mirror Report", style: "header" },
      { text: `Based on ‘The Goddess Within’ by Jennifer & Roger Woolger (1989), adapted within the Emotional Legacy Ascension (ELA) modality by Metro Munk.`, style: 'attribution', margin: [0, 0, 0, 20]},
      
      { text: `Date: ${dateGenerated}`, style: 'body', margin: [0, 0, 0, 20] },

      { text: "Explanation of Archetypes and Masks", style: "sectionHeader" },
      {
        text: [
          "Masks are living archetypes — a single word to describe your winning formula, or survival formula. Each one is a survival formula disguised as a personality, but they are also a clue to our gifts.\n\n",
          "Earlier, we saw how each identity was a sacred adaptation, a brilliant moment when our younger self decided, ‘I’ll be this, so I don’t have to feel that.’\n\n",
          "Those labels — good, strong, invisible, responsible, achiever, rebel, helper, perfect — are masks. Each one is the name your nervous system gave to a survival strategy.\n\n",
          "Archetypes are your soul’s blueprint of energy. When we first came here, when we were born, we were untainted, each soul had their divine template of gifts and inclinations. An archetype is thus a universal psychic pattern or an inner template of energy that lives in all humans.\n\n",
          "Each of these masks began as a sacred archetype — a Lover, a Warrior, a Healer — but somewhere along the way, it got distorted. As trauma happens, we use these light qualities to protect us from the wound, like a shield.\n\n",
          "The mask is not random. It’s a divine archetype bent out of shape by fear, trauma, or unmet need. We end up identifying more with the shield than with the gold underneath. The work is not to destroy the mask, but to reclaim the archetype that lives beneath it."
        ],
        style: "body"
      },

      { text: "Your Primary Mask & Sacred Archetype", style: "sectionHeader" },
      { text: `Primary Mask: ${primaryArchetype.maskName}`, style: "resultLabel" },
      { text: `Sacred Archetype: ${primaryArchetype.sacredArchetype}`, style: "resultImportant" },
      { text: `Secondary Mask: ${secondaryArchetype.maskName}`, style: "resultLabel", margin: [0, 10, 0, 5] },
      
      { text: "Emotional Themes & Core Beliefs", style: "sectionHeader" },
      { text: `Your primary theme of '${primaryArchetype.theme}' is rooted in the wound of '${primaryArchetype.wound}'. This can manifest as limiting beliefs such as:`, style: "body"},
      { ul: primaryArchetype.limitingBeliefs.map((b) => ({ text: b })), style: "body" },

      { text: "Somatic Map & Chakras", style: "sectionHeader" },
      { text: `This archetype often holds tension in the following somatic zones:`, style: "body" },
      { ul: primaryArchetype.somaticZones.map((z) => ({ text: z })), style: "body" },
      { text: "Your dominant chakras are:", style: "body", margin: [0, 10, 0, 5] },
      { ul: archetypeResult.chakra.map((c) => ({ text: c })), style: "body" },

      pairingInsight ? [
        { text: "Archetype Pairing Summary", style: "sectionHeader" },
        { text: `Insight for ${primaryArchetype.maskName} + ${pairingInsight.archetypeB === primaryArchetype.id ? getArchetypeById(pairingInsight.archetypeA)?.maskName : getArchetypeById(pairingInsight.archetypeB)?.maskName}`, style: 'resultLabel'},
        { text: "Attraction Pattern:", bold: true, margin: [0, 10, 0, 2] },
        { ul: pairingInsight.attraction.map((item) => ({text: item}))},
        { text: "Shadow Dance:", bold: true, margin: [0, 10, 0, 2] },
        { ul: pairingInsight.shadowDance.map((item) => ({text: item}))},
      ] : {text: ''},

      { text: "ELA Integration Suggestions", style: "sectionHeader" },
      { text: "Journal Prompts:", bold: true, margin: [0, 5, 0, 2] },
      { ul: [
        `How has the '${primaryArchetype.maskName}' mask protected me?`,
        `What small step can I take to embody my '${primaryArchetype.sacredArchetype}' light gifts?`
      ]},
      { text: "Somatic Cue:", bold: true, margin: [0, 10, 0, 2] },
      { text: "Place a hand on one of your somatic zones (e.g., chest, belly). Breathe into this area and acknowledge the protective strategy. Thank it for keeping you safe."},
      
      { 
        text: [
          '© 2025 Metro Munk All rights reserved. visit ',
          { text: 'www.metromunk.com.au', link: 'http://www.metromunk.com.au', color: 'blue', decoration: 'underline' },
          '.'
        ],
        style: 'copyright' 
      }
    ],

    styles: {
      header: { fontSize: 24, bold: true, margin: [0, 0, 0, 5] },
      attribution: { fontSize: 9, italic: true, color: '#666' },
      sectionHeader: { fontSize: 16, bold: true, margin: [0, 20, 0, 10], color: '#333333' },
      body: { fontSize: 11, margin: [0, 0, 0, 10], lineHeight: 1.3 },
      resultLabel: { fontSize: 12, margin: [0, 0, 0, 5] },
      resultImportant: { fontSize: 14, bold: true, color: '#000000', margin: [0, 5, 0, 15] },
      copyright: { fontSize: 8, italic: true, color: '#999', alignment: 'center', margin: [0, 20, 0, 0] }
    },

    defaultStyle: {
      font: 'Roboto', // pdfmake requires a font name
      fontSize: 11,
      color: '#333333'
    }
  };

  // Helper function for pairing insight, as we can't use hooks here.
  function getArchetypeById(id: string) {
      const allArchetypes = (payload as any).allArchetypes as any[]; // A bit of a hack to pass all archetypes
      return allArchetypes.find(a => a.id === id);
  }

  pdfMake.createPdf(docDefinition).open();
};
