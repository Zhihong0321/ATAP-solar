import { NewsItem } from '@/types/news';

export const mockNews: NewsItem[] = [
  {
    id: '1',
    title_en: 'TNB expands rooftop solar program for SMEs',
    title_cn: '国能扩大中小企业屋顶太阳能计划',
    title_my: 'TNB perluas program solar bumbung untuk PKS',
    content_en:
      'Tenaga Nasional Berhad announced new incentives to accelerate rooftop solar adoption among Malaysian SMEs, targeting atap installations with streamlined approvals.',
    content_cn:
      '国能宣布新的激励措施，加速马来西亚中小企业的屋顶太阳能（atap）采用，并简化审批流程。',
    content_my:
      'TNB mengumumkan insentif baharu untuk mempercepat pemasangan solar atap oleh PKS Malaysia, dengan proses kelulusan yang lebih pantas.',
    news_date: '2025-04-10T09:00:00Z',
    sources: [{ name: 'TNB Release', url: 'https://www.tnb.com.my/' }],
    is_published: true,
    is_highlight: true,
    category: { id: 'c1', name: 'Policy' },
    tags: [{ id: 't1', name: 'SME' }, { id: 't2', name: 'Incentives' }]
  },
  {
    id: '2',
    title_en: 'Selangor launches solar-ready homes pilot',
    title_cn: '雪兰莪推行太阳能预装住宅试点',
    title_my: 'Selangor lancar perintis rumah sedia solar',
    content_en:
      'The state is partnering developers to deliver atap-ready rooftops, aiming for 500 homes in the first phase with net-metering bundled.',
    content_cn: '州政府与发展商合作提供预装太阳能屋顶，首阶段目标 500 户，并捆绑净计量方案。',
    content_my:
      'Kerajaan negeri bekerjasama dengan pemaju untuk menyediakan bumbung sedia solar, mensasarkan 500 rumah fasa pertama termasuk pakej NEM.',
    news_date: '2025-04-05T06:00:00Z',
    sources: [{ name: 'Selangor Gov' }],
    is_published: true,
    is_highlight: true,
    category: { id: 'c2', name: 'Residential' },
    tags: [{ id: 't3', name: 'Pilot Project' }]
  },
  {
    id: '3',
    title_en: 'Green financing window widens for residential rooftops',
    title_cn: '住宅屋顶绿贷窗口扩大',
    title_my: 'Tawaran pembiayaan hijau diperluas untuk bumbung kediaman',
    content_en:
      'Three local banks added RM500m in credit lines earmarked for solar atap systems with tenures up to 15 years.',
    content_cn: '三家本地银行追加 5 亿令吉额度，用于屋顶太阳能系统，期限最长 15 年。',
    content_my:
      'Tiga bank tempatan menambah RM500j talian kredit untuk sistem solar atap dengan tempoh sehingga 15 tahun.',
    news_date: '2025-03-27T08:30:00Z',
    sources: [{ name: 'Bank Releases' }],
    is_published: true,
    is_highlight: false,
    category: { id: 'c3', name: 'Finance' },
    tags: [{ id: 't4', name: 'Banking' }, { id: 't5', name: 'Loans' }]
  },
  {
    id: '4',
    title_en: 'Tech park signs PPA for 8MW rooftop portfolio',
    title_cn: '科技园签署 8MW 屋顶太阳能购电协议',
    title_my: 'Taman teknologi tandatangani PPA portfolio bumbung 8MW',
    content_en:
      'A multi-site PPA will install solar atap arrays across six facilities, reducing grid draw by 18%.',
    content_cn: '多址购电协议将在六个设施安装屋顶光伏阵列，降低 18% 的电网用电。',
    content_my:
      'PPA pelbagai tapak akan memasang susunan solar atap di enam fasiliti, mengurangkan penggunaan grid sebanyak 18%.',
    news_date: '2025-03-18T03:45:00Z',
    sources: [{ name: 'Industry Briefing' }],
    is_published: true,
    is_highlight: false,
    category: { id: 'c4', name: 'Commercial' },
    tags: [{ id: 't6', name: 'PPA' }, { id: 't7', name: 'Tech Park' }]
  }
];
