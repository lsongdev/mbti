import { ready } from 'https://lsong.org/scripts/dom.js';
import { h, render, useState, useEffect } from 'https://lsong.org/scripts/react/index.js';

const loadJSON = async (url) => {
  const res = await fetch(url);
  return res.json();
};

const App = ({ questions, typeDescriptions, dimensionLabels, dimensionLetters }) => {
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

ready(async () => {
  const app = document.getElementById('mbti-app');
  const data = await loadJSON('/data.json');
  const { questions, typeDescriptions, dimensionLabels, dimensionLetters } = data;
  render(h(App, { questions, typeDescriptions, dimensionLabels, dimensionLetters }), app);
});