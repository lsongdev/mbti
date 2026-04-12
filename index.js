import { ready } from 'https://lsong.org/scripts/dom.js';
import { h, render, useState, useEffect } from 'https://lsong.org/scripts/react/index.js';

const questions = [
  // E/I Questions
  { id: 1, dimension: 'EI', text: 'At a party, you usually:', textZh: '在聚会上，你通常：', a: 'Talk to many people, including strangers', aZh: '和很多人交谈，包括陌生人', b: 'Talk mostly to a few people you already know', bZh: '主要和你认识的几个人聊天' },
  { id: 2, dimension: 'EI', text: 'After a long week, you prefer to:', textZh: '漫长的一周后，你更想：', a: 'Go out with friends to recharge', aZh: '和朋友出去玩来放松', b: 'Stay home and relax alone or with one close friend', bZh: '待在家里独自或与一位密友放松' },
  { id: 3, dimension: 'EI', text: 'When working on a project, you prefer:', textZh: '做项目时，你更喜欢：', a: 'Collaborating in a team', aZh: '团队合作', b: 'Working independently', bZh: '独立工作' },
  { id: 4, dimension: 'EI', text: 'You tend to:', textZh: '你倾向于：', a: 'Think out loud and talk through ideas', aZh: '边说边想，通过讨论梳理想法', b: 'Think things through internally before sharing', bZh: '先在心里想清楚再分享' },
  { id: 5, dimension: 'EI', text: 'People who know you well would say you are:', textZh: '了解你的人会评价你：', a: 'Easy to get to know and outgoing', aZh: '容易亲近且外向开朗', b: 'More reserved and private', bZh: '比较内敛和注重隐私' },
  
  // S/N Questions
  { id: 6, dimension: 'SN', text: 'When reading or learning, you prefer:', textZh: '阅读或学习时，你更喜欢：', a: 'Concrete facts and practical examples', aZh: '具体的事实和实际案例', b: 'Theories and abstract concepts', bZh: '理论和抽象概念' },
  { id: 7, dimension: 'SN', text: 'You are more interested in:', textZh: '你对什么更感兴趣：', a: 'What is real and actual right now', aZh: '当下真实存在的事物', b: 'What is possible and what could be', bZh: '可能存在的事物和未来潜力' },
  { id: 8, dimension: 'SN', text: 'You tend to be more:', textZh: '你更倾向于：', a: 'Practical and realistic', aZh: '注重实际和现实', b: 'Imaginative and innovative', bZh: '富有想象力和创新精神' },
  { id: 9, dimension: 'SN', text: 'When following instructions, you prefer:', textZh: '按照指示操作时，你更喜欢：', a: 'Step-by-step detailed directions', aZh: '详细的分步骤指导', b: 'The general idea and figuring out details yourself', bZh: '了解大致思路后自己摸索细节' },
  { id: 10, dimension: 'SN', text: 'You trust more in:', textZh: '你更相信：', a: 'Your direct experience and observation', aZh: '自己的亲身经历和观察', b: 'Your intuition and gut feeling', bZh: '自己的直觉和第六感' },
  
  // T/F Questions
  { id: 11, dimension: 'TF', text: 'When making decisions, you rely more on:', textZh: '做决定时，你更多依赖：', a: 'Logic and objective analysis', aZh: '逻辑和客观分析', b: 'Personal values and how it affects people', bZh: '个人价值观和对他人的影响' },
  { id: 12, dimension: 'TF', text: 'In an argument, you focus more on:', textZh: '争论时，你更关注：', a: 'Finding the truth and being right', aZh: '寻找真相和证明自己正确', b: 'Maintaining harmony and not hurting feelings', bZh: '维持和谐和不伤害感情' },
  { id: 13, dimension: 'TF', text: 'You value more in yourself:', textZh: '你更看重自己的：', a: 'Being fair and objective', aZh: '公平公正和客观理性', b: 'Being compassionate and empathetic', bZh: '富有同情心和共情能力' },
  { id: 14, dimension: 'TF', text: 'When a friend has a problem, you tend to:', textZh: '朋友遇到问题时，你倾向于：', a: 'Offer solutions and analyze the situation', aZh: '提供解决方案并分析情况', b: 'Offer emotional support and listen', bZh: '提供情感支持和倾听' },
  { id: 15, dimension: 'TF', text: 'You are more convinced by:', textZh: '你更容易被什么说服：', a: 'Clear reasoning and evidence', aZh: '清晰的推理和证据', b: 'Personal stories and emotional appeal', bZh: '个人故事和情感共鸣' },
  
  // J/P Questions
  { id: 16, dimension: 'JP', text: 'You prefer your daily routine to be:', textZh: '你更喜欢你的日常安排：', a: 'Planned and organized', aZh: '有计划有条理', b: 'Flexible and spontaneous', bZh: '灵活随性' },
  { id: 17, dimension: 'JP', text: 'When working on a deadline, you usually:', textZh: '面对截止日期时，你通常：', a: 'Start early and work steadily', aZh: '早早开始，稳步推进', b: 'Work in bursts of energy close to the deadline', bZh: '临近截止日期时集中突击' },
  { id: 18, dimension: 'JP', text: 'Your workspace is usually:', textZh: '你的工作区域通常：', a: 'Neat and organized', aZh: '整洁有序', b: 'Somewhat messy but you know where things are', bZh: '有点乱但你知道东西在哪' },
  { id: 19, dimension: 'JP', text: 'When making plans, you prefer to:', textZh: '制定计划时，你更喜欢：', a: 'Decide in advance and stick to the plan', aZh: '提前决定并按计划执行', b: 'Keep options open and decide as you go', bZh: '保持灵活，边走边决定' },
  { id: 20, dimension: 'JP', text: 'You feel better when:', textZh: '什么时候你感觉更舒服：', a: 'Things are settled and decided', aZh: '事情都安排妥当、尘埃落定时', b: 'You have options and can adapt as needed', bZh: '有选择余地、能随机应变时' },
];

const typeDescriptions = {
  'INTJ': { en: 'The Architect - Strategic thinkers who enjoy planning and organizing. Independent, determined, and innovative.', zh: '建筑师 - 喜欢规划和组织的战略思想家。独立、坚定且富有创新精神。' },
  'INTP': { en: 'The Logician - Innovative inventors with an unquenchable thirst for knowledge. Logical and analytical.', zh: '逻辑学家 - 对知识有无尽渴望的创新发明家。逻辑性强且善于分析。' },
  'ENTJ': { en: 'The Commander - Bold, imaginative leaders with a strong will to succeed. Strategic and efficient.', zh: '指挥官 - 大胆、富有想象力的领导者，有强烈的成功意志。战略性强且高效。' },
  'ENTP': { en: 'The Debater - Smart and curious thinkers who love intellectual challenges and debates.', zh: '辩论家 - 聪明且充满好奇心的思考者，热爱智力挑战和辩论。' },
  'INFJ': { en: 'The Advocate - Quiet and mystical visionaries who are inspired idealists. Principled and compassionate.', zh: '提倡者 - 安静而神秘的理想主义者。有原则且富有同情心。' },
  'INFP': { en: 'The Mediator - Poetic, kind altruists who are always eager to help a good cause. Creative and empathetic.', zh: '调停者 - 诗意、善良且乐于助人的人。富有创造力和共情能力。' },
  'ENFJ': { en: 'The Protagonist - Charismatic and inspiring leaders who genuinely care about others. Natural born leaders.', zh: '主人公 - 充满魅力且鼓舞人心的领导者，真心关怀他人。天生的领导者。' },
  'ENFP': { en: 'The Campaigner - Enthusiastic, creative free spirits who can always find a reason to smile. Spontaneous and energetic.', zh: '竞选者 - 热情、富有创造力的自由灵魂，总能找到微笑的理由。 spontane性强且充满活力。' },
  'ISTJ': { en: 'The Logistician - Practical and fact-minded individuals whose reliability cannot be doubted. Responsible and organized.', zh: '物流师 - 务实且注重实际的人，可靠性毋庸置疑。责任心强且有条理。' },
  'ISFJ': { en: 'The Defender - Very dedicated and warm protectors, always ready to defend their loved ones. Reliable and patient.', zh: '守卫者 - 非常敬业且温暖的保护者，时刻准备守护所爱之人。可靠且有耐心。' },
  'ESTJ': { en: 'The Executive - Excellent administrators who are good at managing things or people. Organized and practical.', zh: '总经理 - 出色的管理者，善于管理事务或人员。有条理且务实。' },
  'ESFJ': { en: 'The Consul - Extraordinarily caring, social and popular people, always eager to help. Conscientious and harmonious.', zh: '执政官 - 极其关心他人、善于社交且受欢迎的人，乐于助人。有责任心且追求和谐。' },
  'ISTP': { en: 'The Virtuoso - Bold and practical experimenters, masters of all kinds of tools. Hands-on and analytical.', zh: '鉴赏家 - 大胆且务实的实验家，擅长使用各种工具。动手能力强且善于分析。' },
  'ISFP': { en: 'The Adventurer - Flexible and charming artists, always ready to explore and experience something new. Creative and curious.', zh: '探险家 - 灵活且有魅力的艺术家，随时准备探索新事物。富有创造力和好奇心。' },
  'ESTP': { en: 'The Entrepreneur - Smart, energetic and very perceptive people, who truly enjoy living on the edge. Active and spontaneous.', zh: '企业家 - 聪明、精力充沛且洞察力极强的人，真正享受走在边缘的刺激。活跃且 spontane性强。' },
  'ESFP': { en: 'The Entertainer - Spontaneous, energetic and enthusiastic people — life is never boring around them. Playful and sociable.', zh: '表演者 -  spontane性、精力充沛且充满热情的人——有他们在永远不会无聊。爱玩且善于社交。' },
};

const dimensionLabels = {
  'EI': { 
    left: { en: 'Extraversion (E)', zh: '外向 (E)' }, 
    right: { en: 'Introversion (I)', zh: '内向 (I)' },
    explain: {
      en: 'Extraversion (E) vs Introversion (I) describes where you direct your attention and get energy. Extraverts prefer outer world of people and activity, while Introverts prefer inner world of ideas and reflection.',
      zh: '外向 (E) 与 内向 (I) 描述了你注意力的方向和能量来源。外向者从外部世界（人和活动）获得能量，而内向者从内心世界（想法和反思）获得能量。'
    }
  },
  'SN': { 
    left: { en: 'Sensing (S)', zh: '感觉 (S)' }, 
    right: { en: 'Intuition (N)', zh: '直觉 (N)' },
    explain: {
      en: 'Sensing (S) vs Intuition (N) describes how you take in information. Sensors prefer concrete, practical information through their senses, while Intuitives prefer patterns, meanings, and possibilities.',
      zh: '感觉 (S) 与 直觉 (N) 描述了你如何接收信息。感觉型偏好具体的、通过感官获得的实际信息，而直觉型偏好模式、含义和可能性。'
    }
  },
  'TF': { 
    left: { en: 'Thinking (T)', zh: '思考 (T)' }, 
    right: { en: 'Feeling (F)', zh: '情感 (F)' },
    explain: {
      en: 'Thinking (T) vs Feeling (F) describes how you make decisions. Thinkers prefer logic and objective analysis, while Feelers consider personal values and the impact on people.',
      zh: '思考 (T) 与 情感 (F) 描述了你如何做决定。思考型偏好逻辑和客观分析，而情感型会考虑个人价值观和对他人的影响。'
    }
  },
  'JP': { 
    left: { en: 'Judging (J)', zh: '判断 (J)' }, 
    right: { en: 'Perceiving (P)', zh: '感知 (P)' },
    explain: {
      en: 'Judging (J) vs Perceiving (P) describes how you deal with the outer world. Judging types prefer structure, planning, and decisiveness, while Perceiving types prefer flexibility, spontaneity, and keeping options open.',
      zh: '判断 (J) 与 感知 (P) 描述了你如何应对外部世界。判断型偏好结构、计划和果断，而感知型偏好灵活、 spontane性和保持选择开放。'
    }
  },
};

const dimensionLetters = {
  'EI': { left: 'E', right: 'I' },
  'SN': { left: 'S', right: 'N' },
  'TF': { left: 'T', right: 'F' },
  'JP': { left: 'J', right: 'P' },
};

const App = () => {
  const [answers, setAnswers] = useState({});
  const [isStarted, setIsStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  // Detect browser language
  const getBrowserLang = () => {
    const browserLang = navigator.language || navigator.userLanguage;
    return browserLang.startsWith('zh') ? 'zh' : 'en';
  };
  const [lang, setLang] = useState(getBrowserLang);

  const t = (en, zh) => lang === 'zh' ? zh : en;

  const handleStart = () => {
    setIsStarted(true);
    setAnswers({});
    setIsComplete(false);
  };

  const handleAnswer = (questionIndex, value) => {
    setAnswers({ ...answers, [questionIndex]: value });
  };

  const handleSubmit = () => {
    setIsComplete(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleLang = () => {
    setLang(lang === 'en' ? 'zh' : 'en');
  };

  const calculateResult = () => {
    const scores = { EI: 0, SN: 0, TF: 0, JP: 0 };
    
    questions.forEach((q, idx) => {
      const answer = answers[idx];
      if (answer === 'a') {
        scores[q.dimension]++;
      } else if (answer === 'b') {
        scores[q.dimension]--;
      }
    });

    let type = '';
    type += scores.EI >= 0 ? 'E' : 'I';
    type += scores.SN >= 0 ? 'S' : 'N';
    type += scores.TF >= 0 ? 'T' : 'F';
    type += scores.JP >= 0 ? 'J' : 'P';

    return { type, scores };
  };

  if (!isStarted) {
    return h('div', { className: 'mbti-container' }, [
      h('div', { style: { textAlign: 'right', marginBottom: '16px' } }, [
        h('button', {
          className: 'mbti-btn',
          style: { padding: '8px 16px', fontSize: '14px', background: '#f0f0f0' },
          onClick: toggleLang
        }, lang === 'en' ? '中文' : 'English')
      ]),
      h('div', { className: 'mbti-start' }, [
        h('h3', null, t('Ready to discover your personality type?', '准备好探索你的人格类型了吗？')),
        h('p', null, t('This test consists of 20 questions. Answer honestly and choose the option that best describes you most of the time.', '本测试包含20道题目。请诚实作答，选择最符合你平常表现的选项。')),
        h('div', { 
          style: { 
            textAlign: 'left', 
            background: '#f8f9ff', 
            padding: '20px', 
            borderRadius: '12px',
            marginBottom: '24px'
          } 
        }, [
          h('h4', { style: { marginBottom: '12px' } }, t('What does MBTI measure?', 'MBTI 测量什么？')),
          h('p', { style: { marginBottom: '12px', lineHeight: '1.6' } },
            t('MBTI measures 4 dimensions of personality, resulting in a 4-letter type:',
              'MBTI 测量人格的4个维度，结果是一个4字母的类型：')
          ),
          h('ul', { style: { lineHeight: '1.8' } }, [
            h('li', null, [
              h('strong', null, 'E/I'),
              ' - ',
              t('Where you get energy (Extraversion vs Introversion)',
                '能量来源（外向 vs 内向）')
            ]),
            h('li', null, [
              h('strong', null, 'S/N'),
              ' - ',
              t('How you take in information (Sensing vs Intuition)',
                '信息接收方式（感觉 vs 直觉）')
            ]),
            h('li', null, [
              h('strong', null, 'T/F'),
              ' - ',
              t('How you make decisions (Thinking vs Feeling)',
                '决策方式（思考 vs 情感）')
            ]),
            h('li', null, [
              h('strong', null, 'J/P'),
              ' - ',
              t('How you deal with the outer world (Judging vs Perceiving)',
                '应对外部世界的方式（判断 vs 感知）')
            ])
          ])
        ]),
        h('button', { 
          className: 'mbti-btn mbti-btn-primary',
          onClick: handleStart
        }, t('Start the Test', '开始测试')),
      ])
    ]);
  }

  if (isComplete) {
    const { type, scores } = calculateResult();
    const desc = typeDescriptions[type] || { en: 'A unique individual with a blend of traits.', zh: '拥有独特特质混合的个体。' };
    const description = lang === 'zh' ? desc.zh : desc.en;

    const dimensions = Object.keys(dimensionLabels).map(dim => {
      const score = scores[dim];
      const total = 5;
      const percentage = Math.round(((score + total) / (total * 2)) * 100);
      const leftLetter = dimensionLetters[dim].left;
      const rightLetter = dimensionLetters[dim].right;
      const isLeft = score >= 0;
      const dimLabel = dimensionLabels[dim];

      return h('div', { className: 'mbti-dimension' }, [
        h('div', { className: 'mbti-dimension-label' }, 
          (lang === 'zh' ? dimLabel.left.zh : dimLabel.left.en) + ' vs ' + (lang === 'zh' ? dimLabel.right.zh : dimLabel.right.en)
        ),
        h('div', { className: 'mbti-dimension-bar' }, [
          h('div', { 
            className: 'mbti-dimension-fill',
            style: { width: isLeft ? percentage + '%' : (100 - percentage) + '%' }
          })
        ]),
        h('div', { className: 'mbti-dimension-values' }, [
          h('span', { className: isLeft ? 'mbti-dimension-selected' : '' }, leftLetter + ' - ' + percentage + '%'),
          h('span', { className: !isLeft ? 'mbti-dimension-selected' : '' }, rightLetter + ' - ' + (100 - percentage) + '%'),
        ])
      ]);
    });

    const dimensionExplanations = Object.keys(dimensionLabels).map(dim => {
      const dimLabel = dimensionLabels[dim];
      const score = scores[dim];
      const selectedLetter = score >= 0 ? dimensionLetters[dim].left : dimensionLetters[dim].right;
      const selectedSide = score >= 0 ? 'left' : 'right';
      const selectedName = lang === 'zh' ? dimLabel[selectedSide].zh : dimLabel[selectedSide].en;

      return h('div', { 
        key: dim,
        style: { 
          marginBottom: '20px',
          padding: '16px',
          background: '#f8f9ff',
          borderRadius: '12px'
        }
      }, [
        h('h4', { style: { marginBottom: '8px' } }, [
          h('span', { className: 'mbti-dimension-selected' }, selectedLetter + ' - ' + selectedName)
        ]),
        h('p', { style: { lineHeight: '1.6', color: '#666' } },
          lang === 'zh' ? dimLabel.explain.zh : dimLabel.explain.en
        )
      ]);
    });

    return h('div', { className: 'mbti-container' }, [
      h('div', { style: { textAlign: 'right', marginBottom: '16px' } }, [
        h('button', {
          className: 'mbti-btn',
          style: { padding: '8px 16px', fontSize: '14px', background: '#f0f0f0' },
          onClick: toggleLang
        }, lang === 'en' ? '中文' : 'English')
      ]),
      h('div', { className: 'mbti-result' }, [
        h('h3', null, t('Your Personality Type', '你的人格类型')),
        h('div', { className: 'mbti-result-type' }, type),
        h('div', { className: 'mbti-result-description' }, description),
        h('h4', { style: { marginBottom: '16px', textAlign: 'left' } }, t('Your Dimensions', '你的维度')),
        h('div', { className: 'mbti-dimensions' }, dimensions),
        h('h4', { style: { marginBottom: '16px', textAlign: 'left' } }, t('Dimension Explanations', '维度解释')),
        h('div', null, dimensionExplanations),
        h('button', { 
          className: 'mbti-btn mbti-btn-primary',
          onClick: handleStart
        }, t('Take the Test Again', '重新测试')),
      ])
    ]);
  }

  const allAnswered = Object.keys(answers).length === questions.length;

  const questionList = questions.map((question, idx) => {
    const isAnswered = answers[idx] !== undefined;
    const questionText = lang === 'zh' ? question.textZh : question.text;
    const optionA = lang === 'zh' ? question.aZh : question.a;
    const optionB = lang === 'zh' ? question.bZh : question.b;
    
    return h('div', { 
      key: question.id,
      className: 'mbti-question-item' + (isAnswered ? ' answered' : '')
    }, [
      h('h4', null, [
        h('span', { className: 'question-number' }, 'Q' + (idx + 1) + '.'),
        questionText
      ]),
      h('div', { className: 'mbti-options-list' }, [
        h('div', { 
          key: 'a',
          className: 'mbti-option-list',
          onClick: () => handleAnswer(idx, 'a')
        }, [
          h('input', {
            type: 'radio',
            name: 'q' + question.id,
            id: 'q' + question.id + 'a',
            checked: answers[idx] === 'a',
            onChange: () => handleAnswer(idx, 'a')
          }),
          h('label', { htmlFor: 'q' + question.id + 'a' }, optionA)
        ]),
        h('div', {
          key: 'b',
          className: 'mbti-option-list',
          onClick: () => handleAnswer(idx, 'b')
        }, [
          h('input', {
            type: 'radio',
            name: 'q' + question.id,
            id: 'q' + question.id + 'b',
            checked: answers[idx] === 'b',
            onChange: () => handleAnswer(idx, 'b')
          }),
          h('label', { htmlFor: 'q' + question.id + 'b' }, optionB)
        ])
      ])
    ]);
  });

  const btnText = allAnswered 
    ? t('See My Results', '查看我的结果') 
    : t('Answer All Questions', '请回答所有题目') + ' (' + Object.keys(answers).length + '/20)';

  return h('div', { className: 'mbti-container' }, [
    h('div', { style: { textAlign: 'right', marginBottom: '16px' } }, [
      h('button', {
        className: 'mbti-btn',
        style: { padding: '8px 16px', fontSize: '14px', background: '#f0f0f0' },
        onClick: toggleLang
      }, lang === 'en' ? '中文' : 'English')
    ]),
    h('div', { className: 'mbti-questions-list' }, questionList),
    h('button', { 
      className: 'mbti-btn mbti-btn-primary',
      onClick: handleSubmit,
      disabled: !allAnswered
    }, btnText)
  ]);
}

ready(() => {
  const app = document.getElementById('mbti-app');
  render(h(App), app);
});