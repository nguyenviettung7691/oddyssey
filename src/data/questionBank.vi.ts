import { randomUUID } from '@/utils/id';
import type { DifficultyLevel, GameQuestion } from '@/types/game';

interface RawQuestion {
  id: string;
  prompt: string;
  difficulty: DifficultyLevel;
  options: Array<{ text: string; isOddOneOut: boolean }>;
}

const footballQuestions: RawQuestion[] = [
  {
    id: 'football-easy-1',
    prompt: 'Màu áo nào không thuộc bộ trang phục sân nhà truyền thống của FC Barcelona?',
    difficulty: 'easy',
    options: [
      { text: 'Xanh đậm', isOddOneOut: false },
      { text: 'Đỏ thẫm', isOddOneOut: false },
      { text: 'Vàng kim', isOddOneOut: true },
      { text: 'Sọc xanh đen', isOddOneOut: false },
    ],
  },
  {
    id: 'football-easy-2',
    prompt: 'Tìm người khác biệt trong số các tiền đạo huyền thoại.',
    difficulty: 'easy',
    options: [
      { text: 'Thierry Henry', isOddOneOut: false },
      { text: 'Ronaldo Nazario', isOddOneOut: false },
      { text: 'Iker Casillas', isOddOneOut: true },
      { text: 'Didier Drogba', isOddOneOut: false },
    ],
  },
  {
    id: 'football-medium-1',
    prompt: 'Ba trong số các câu lạc bộ này đã vô địch UEFA Champions League nhiều lần. Đội nào chưa?',
    difficulty: 'medium',
    options: [
      { text: 'A.C. Milan', isOddOneOut: false },
      { text: 'Nottingham Forest', isOddOneOut: false },
      { text: 'Olympique Lyonnais', isOddOneOut: true },
      { text: 'Real Madrid', isOddOneOut: false },
    ],
  },
  {
    id: 'football-medium-2',
    prompt: 'Chọn đội hình chiến thuật không thường liên quan đến hệ thống ba hậu vệ.',
    difficulty: 'medium',
    options: [
      { text: '3-4-3', isOddOneOut: false },
      { text: '3-5-2', isOddOneOut: false },
      { text: '4-2-3-1', isOddOneOut: true },
      { text: '3-1-4-2', isOddOneOut: false },
    ],
  },
  {
    id: 'football-hard-1',
    prompt: 'Xác định câu lạc bộ không thi đấu ở Bundesliga.',
    difficulty: 'hard',
    options: [
      { text: 'Borussia Dortmund', isOddOneOut: false },
      { text: 'RB Leipzig', isOddOneOut: false },
      { text: 'FC Cincinnati', isOddOneOut: true },
      { text: 'Bayer Leverkusen', isOddOneOut: false },
    ],
  },
  {
    id: 'football-expert-1',
    prompt: 'Yếu tố nào trong luật bóng đá không thuộc tiêu chí phạm lỗi việt vị?',
    difficulty: 'expert',
    options: [
      { text: 'Đứng ngang hàng với hậu vệ áp chót', isOddOneOut: false },
      { text: 'Hưởng lợi từ bóng bật lại', isOddOneOut: false },
      { text: 'Nhận bóng trực tiếp từ ném biên', isOddOneOut: true },
      { text: 'Cản trở đối phương', isOddOneOut: false },
    ],
  },
  {
    id: 'football-easy-3',
    prompt: 'Cầu thủ nào trong số này chưa từng giành Quả bóng vàng?',
    difficulty: 'easy',
    options: [
      { text: 'Lionel Messi', isOddOneOut: false },
      { text: 'Cristiano Ronaldo', isOddOneOut: false },
      { text: 'Neymar Jr', isOddOneOut: true },
      { text: 'Luka Modrić', isOddOneOut: false },
    ],
  },
  {
    id: 'football-medium-3',
    prompt: 'Ba sân vận động đã tổ chức trận chung kết FIFA World Cup. Sân nào chưa?',
    difficulty: 'medium',
    options: [
      { text: 'Maracanã', isOddOneOut: false },
      { text: 'Wembley Stadium', isOddOneOut: false },
      { text: 'Camp Nou', isOddOneOut: true },
      { text: 'Lusail Stadium', isOddOneOut: false },
    ],
  },
  {
    id: 'football-hard-2',
    prompt: 'Quốc gia nào trong số này chưa từng vô địch Copa América?',
    difficulty: 'hard',
    options: [
      { text: 'Uruguay', isOddOneOut: false },
      { text: 'Argentina', isOddOneOut: false },
      { text: 'Mexico', isOddOneOut: true },
      { text: 'Chile', isOddOneOut: false },
    ],
  },
  {
    id: 'football-hard-3',
    prompt: 'Xác định cầu thủ chưa từng ghi bàn trong trận chung kết Champions League.',
    difficulty: 'hard',
    options: [
      { text: 'Sergio Ramos', isOddOneOut: false },
      { text: 'Zinedine Zidane', isOddOneOut: false },
      { text: 'Gianluigi Buffon', isOddOneOut: true },
      { text: 'Steven Gerrard', isOddOneOut: false },
    ],
  },
  {
    id: 'football-expert-2',
    prompt: 'Thay đổi luật nào không nằm trong bản sửa đổi Luật Bóng đá IFAB năm 2019?',
    difficulty: 'expert',
    options: [
      { text: 'Cầu thủ tấn công bị cấm đứng trong hàng rào', isOddOneOut: false },
      { text: 'Phát bóng từ cầu môn không cần ra khỏi vùng cấm', isOddOneOut: false },
      { text: 'VAR bắt buộc cho tất cả các giải chuyên nghiệp', isOddOneOut: true },
      { text: 'Cầu thủ bị thay ra phải rời sân ở vạch gần nhất', isOddOneOut: false },
    ],
  },
];

const animeQuestions: RawQuestion[] = [
  {
    id: 'anime-easy-1',
    prompt: 'Bộ phim nào trong số này không phải của Studio Ghibli?',
    difficulty: 'easy',
    options: [
      { text: 'Spirited Away', isOddOneOut: false },
      { text: 'Your Name', isOddOneOut: true },
      { text: 'Howl\'s Moving Castle', isOddOneOut: false },
      { text: 'Princess Mononoke', isOddOneOut: false },
    ],
  },
  {
    id: 'anime-easy-2',
    prompt: 'Ba nhân vật chính sử dụng kiếm làm vũ khí chính. Ai không?',
    difficulty: 'easy',
    options: [
      { text: 'Ichigo Kurosaki', isOddOneOut: false },
      { text: 'Roronoa Zoro', isOddOneOut: false },
      { text: 'Light Yagami', isOddOneOut: true },
      { text: 'Tanjiro Kamado', isOddOneOut: false },
    ],
  },
  {
    id: 'anime-medium-1',
    prompt: 'Xác định bộ anime không bắt nguồn từ Shonen Jump.',
    difficulty: 'medium',
    options: [
      { text: 'Jujutsu Kaisen', isOddOneOut: false },
      { text: 'My Hero Academia', isOddOneOut: false },
      { text: 'Attack on Titan', isOddOneOut: true },
      { text: 'Black Clover', isOddOneOut: false },
    ],
  },
  {
    id: 'anime-medium-2',
    prompt: 'Ba nhà soạn nhạc đã sáng tác nhạc phim cho các bộ shonen lớn. Ai là người khác biệt?',
    difficulty: 'medium',
    options: [
      { text: 'Yuki Hayashi', isOddOneOut: false },
      { text: 'Hiroyuki Sawano', isOddOneOut: false },
      { text: 'Hans Zimmer', isOddOneOut: true },
      { text: 'Shiro Sagisu', isOddOneOut: false },
    ],
  },
  {
    id: 'anime-hard-1',
    prompt: 'Tìm bộ anime ra mắt sau năm 2015.',
    difficulty: 'hard',
    options: [
      { text: 'Mob Psycho 100', isOddOneOut: true },
      { text: 'Haikyuu!!', isOddOneOut: false },
      { text: 'JoJo\'s Bizarre Adventure: Stardust Crusaders', isOddOneOut: false },
      { text: 'Hunter x Hunter (2011)', isOddOneOut: false },
    ],
  },
  {
    id: 'anime-expert-1',
    prompt: 'Ba trong số các tác giả này đã giành giải Tezuka Osamu Cultural Prize. Ai chưa?',
    difficulty: 'expert',
    options: [
      { text: 'Naoki Urasawa', isOddOneOut: false },
      { text: 'Rumiko Takahashi', isOddOneOut: false },
      { text: 'Eiichiro Oda', isOddOneOut: true },
      { text: 'Kazuhiro Fujita', isOddOneOut: false },
    ],
  },
  {
    id: 'anime-easy-3',
    prompt: 'Ba trong số này là anime mecha. Bộ nào không phải?',
    difficulty: 'easy',
    options: [
      { text: 'Neon Genesis Evangelion', isOddOneOut: false },
      { text: 'Code Geass', isOddOneOut: false },
      { text: 'Death Note', isOddOneOut: true },
      { text: 'Gurren Lagann', isOddOneOut: false },
    ],
  },
  {
    id: 'anime-medium-3',
    prompt: 'Bộ anime nào không được sản xuất bởi studio MAPPA?',
    difficulty: 'medium',
    options: [
      { text: 'Jujutsu Kaisen', isOddOneOut: false },
      { text: 'Attack on Titan: The Final Season', isOddOneOut: false },
      { text: 'Spy x Family', isOddOneOut: true },
      { text: 'Chainsaw Man', isOddOneOut: false },
    ],
  },
  {
    id: 'anime-hard-2',
    prompt: 'Ba trong số các anime này phát sóng lần đầu trước năm 2010. Bộ nào không?',
    difficulty: 'hard',
    options: [
      { text: 'Naruto', isOddOneOut: false },
      { text: 'Bleach', isOddOneOut: false },
      { text: 'Sword Art Online', isOddOneOut: true },
      { text: 'Fullmetal Alchemist', isOddOneOut: false },
    ],
  },
  {
    id: 'anime-hard-3',
    prompt: 'Bộ anime nào trong số này không được sản xuất bởi studio Bones?',
    difficulty: 'hard',
    options: [
      { text: 'Fullmetal Alchemist: Brotherhood', isOddOneOut: false },
      { text: 'My Hero Academia', isOddOneOut: false },
      { text: 'Cowboy Bebop', isOddOneOut: true },
      { text: 'Mob Psycho 100', isOddOneOut: false },
    ],
  },
  {
    id: 'anime-expert-2',
    prompt: 'Bộ anime nào trong số này không được chuyển thể từ light novel?',
    difficulty: 'expert',
    options: [
      { text: 'Sword Art Online', isOddOneOut: false },
      { text: 'Re:Zero', isOddOneOut: false },
      { text: 'Fullmetal Alchemist', isOddOneOut: true },
      { text: 'No Game No Life', isOddOneOut: false },
    ],
  },
];

const scienceQuestions: RawQuestion[] = [
  {
    id: 'science-easy-1',
    prompt: 'Chất nào trong số này không phải là khí hiếm?',
    difficulty: 'easy',
    options: [
      { text: 'Heli', isOddOneOut: false },
      { text: 'Neon', isOddOneOut: false },
      { text: 'Oxy', isOddOneOut: true },
      { text: 'Argon', isOddOneOut: false },
    ],
  },
  {
    id: 'science-easy-2',
    prompt: 'Ba phát minh đã cách mạng hóa việc sử dụng điện. Phát minh nào không?',
    difficulty: 'easy',
    options: [
      { text: 'Động cơ điện xoay chiều', isOddOneOut: false },
      { text: 'Đèn LED', isOddOneOut: false },
      { text: 'Tuabin hơi nước', isOddOneOut: true },
      { text: 'Pin lithium-ion', isOddOneOut: false },
    ],
  },
  {
    id: 'science-medium-1',
    prompt: 'Tìm nhà khoa học không công bố công trình về thuyết tiến hóa.',
    difficulty: 'medium',
    options: [
      { text: 'Charles Darwin', isOddOneOut: false },
      { text: 'Alfred Russel Wallace', isOddOneOut: false },
      { text: 'Jean-Baptiste Lamarck', isOddOneOut: false },
      { text: 'Gregor Mendel', isOddOneOut: true },
    ],
  },
  {
    id: 'science-medium-2',
    prompt: 'Chọn tàu vũ trụ không khám phá Sao Hỏa.',
    difficulty: 'medium',
    options: [
      { text: 'Viking 1', isOddOneOut: false },
      { text: 'Curiosity', isOddOneOut: false },
      { text: 'Cassini-Huygens', isOddOneOut: true },
      { text: 'Perseverance', isOddOneOut: false },
    ],
  },
  {
    id: 'science-hard-1',
    prompt: 'Ba lĩnh vực thuộc cơ học cổ điển. Lĩnh vực nào không?',
    difficulty: 'hard',
    options: [
      { text: 'Động học', isOddOneOut: false },
      { text: 'Động lực học', isOddOneOut: false },
      { text: 'Nhiệt động lực học', isOddOneOut: true },
      { text: 'Tĩnh học', isOddOneOut: false },
    ],
  },
  {
    id: 'science-expert-1',
    prompt: 'Khái niệm nào không thuộc Mô hình Chuẩn của vật lý hạt?',
    difficulty: 'expert',
    options: [
      { text: 'Hạt Higgs boson', isOddOneOut: false },
      { text: 'Boson W và Z', isOddOneOut: false },
      { text: 'Graviton', isOddOneOut: true },
      { text: 'Gluon', isOddOneOut: false },
    ],
  },
  {
    id: 'science-easy-3',
    prompt: 'Thiên thể nào trong số này không phải là hành tinh trong hệ Mặt Trời?',
    difficulty: 'easy',
    options: [
      { text: 'Sao Hỏa', isOddOneOut: false },
      { text: 'Sao Mộc', isOddOneOut: false },
      { text: 'Sao Diêm Vương', isOddOneOut: true },
      { text: 'Sao Thổ', isOddOneOut: false },
    ],
  },
  {
    id: 'science-medium-3',
    prompt: 'Ba trong số các nhà khoa học này đã giành giải Nobel Vật lý. Ai chưa?',
    difficulty: 'medium',
    options: [
      { text: 'Albert Einstein', isOddOneOut: false },
      { text: 'Niels Bohr', isOddOneOut: false },
      { text: 'Nikola Tesla', isOddOneOut: true },
      { text: 'Richard Feynman', isOddOneOut: false },
    ],
  },
  {
    id: 'science-hard-2',
    prompt: 'Hạt nào không được phân loại là lepton?',
    difficulty: 'hard',
    options: [
      { text: 'Electron', isOddOneOut: false },
      { text: 'Muon', isOddOneOut: false },
      { text: 'Pion', isOddOneOut: true },
      { text: 'Tau', isOddOneOut: false },
    ],
  },
  {
    id: 'science-hard-3',
    prompt: 'Ba trong số các nguyên tố này thuộc nhóm Lantan. Nguyên tố nào không?',
    difficulty: 'hard',
    options: [
      { text: 'Xeri', isOddOneOut: false },
      { text: 'Europi', isOddOneOut: false },
      { text: 'Zirconi', isOddOneOut: true },
      { text: 'Gadolini', isOddOneOut: false },
    ],
  },
  {
    id: 'science-expert-2',
    prompt: 'Hiện tượng nào không được tiên đoán bởi thuyết tương đối rộng?',
    difficulty: 'expert',
    options: [
      { text: 'Thấu kính hấp dẫn', isOddOneOut: false },
      { text: 'Hiệu ứng kéo lê khung', isOddOneOut: false },
      { text: 'Hiệu ứng đường hầm lượng tử', isOddOneOut: true },
      { text: 'Giãn nở thời gian do hấp dẫn', isOddOneOut: false },
    ],
  },
];

const spaceExplorersQuestions: RawQuestion[] = [
  {
    id: 'space-explorers-easy-1',
    prompt: 'Ba trong số các phi hành gia này đã đặt chân lên Mặt Trăng. Ai chưa?',
    difficulty: 'easy',
    options: [
      { text: 'Neil Armstrong', isOddOneOut: false },
      { text: 'Buzz Aldrin', isOddOneOut: false },
      { text: 'Michael Collins', isOddOneOut: true },
      { text: 'Alan Shepard', isOddOneOut: false },
    ],
  },
  {
    id: 'space-explorers-easy-2',
    prompt: 'Cơ quan vũ trụ nào không phải là đối tác trên Trạm Vũ trụ Quốc tế?',
    difficulty: 'easy',
    options: [
      { text: 'NASA', isOddOneOut: false },
      { text: 'ESA', isOddOneOut: false },
      { text: 'CNSA', isOddOneOut: true },
      { text: 'JAXA', isOddOneOut: false },
    ],
  },
  {
    id: 'space-explorers-easy-3',
    prompt: 'Ba trong số này là tàu con thoi của NASA. Tàu nào không phải?',
    difficulty: 'easy',
    options: [
      { text: 'Columbia', isOddOneOut: false },
      { text: 'Discovery', isOddOneOut: false },
      { text: 'Apollo', isOddOneOut: true },
      { text: 'Atlantis', isOddOneOut: false },
    ],
  },
  {
    id: 'space-explorers-medium-1',
    prompt: 'Sứ mệnh nào không thuộc chương trình Apollo?',
    difficulty: 'medium',
    options: [
      { text: 'Apollo 11', isOddOneOut: false },
      { text: 'Apollo 13', isOddOneOut: false },
      { text: 'Gemini 4', isOddOneOut: true },
      { text: 'Apollo 17', isOddOneOut: false },
    ],
  },
  {
    id: 'space-explorers-medium-2',
    prompt: 'Ba trong số này là vệ tinh của Sao Mộc. Vệ tinh nào không phải?',
    difficulty: 'medium',
    options: [
      { text: 'Europa', isOddOneOut: false },
      { text: 'Ganymede', isOddOneOut: false },
      { text: 'Titan', isOddOneOut: true },
      { text: 'Callisto', isOddOneOut: false },
    ],
  },
  {
    id: 'space-explorers-medium-3',
    prompt: 'Xe tự hành nào không được thiết kế để khám phá Sao Hỏa?',
    difficulty: 'medium',
    options: [
      { text: 'Opportunity', isOddOneOut: false },
      { text: 'Spirit', isOddOneOut: false },
      { text: 'Yutu', isOddOneOut: true },
      { text: 'Curiosity', isOddOneOut: false },
    ],
  },
  {
    id: 'space-explorers-hard-1',
    prompt: 'Tàu vũ trụ nào không có quỹ đạo rời khỏi hệ Mặt Trời?',
    difficulty: 'hard',
    options: [
      { text: 'Voyager 1', isOddOneOut: false },
      { text: 'Voyager 2', isOddOneOut: false },
      { text: 'Juno', isOddOneOut: true },
      { text: 'New Horizons', isOddOneOut: false },
    ],
  },
  {
    id: 'space-explorers-hard-2',
    prompt: 'Ba trong số các phi hành gia này đã chỉ huy một sứ mệnh Apollo. Ai chưa?',
    difficulty: 'hard',
    options: [
      { text: 'Jim Lovell', isOddOneOut: false },
      { text: 'Frank Borman', isOddOneOut: false },
      { text: 'John Glenn', isOddOneOut: true },
      { text: 'Alan Shepard', isOddOneOut: false },
    ],
  },
  {
    id: 'space-explorers-hard-3',
    prompt: 'Kính thiên văn nào không hoạt động chủ yếu ở bước sóng hồng ngoại?',
    difficulty: 'hard',
    options: [
      { text: 'James Webb Space Telescope', isOddOneOut: false },
      { text: 'Spitzer Space Telescope', isOddOneOut: false },
      { text: 'Chandra X-ray Observatory', isOddOneOut: true },
      { text: 'Herschel Space Observatory', isOddOneOut: false },
    ],
  },
  {
    id: 'space-explorers-expert-1',
    prompt: 'Phương pháp đẩy nào chưa được sử dụng trên tàu vũ trụ thực tế?',
    difficulty: 'expert',
    options: [
      { text: 'Động cơ ion', isOddOneOut: false },
      { text: 'Buồm Mặt Trời', isOddOneOut: false },
      { text: 'EmDrive', isOddOneOut: true },
      { text: 'Động cơ hiệu ứng Hall', isOddOneOut: false },
    ],
  },
  {
    id: 'space-explorers-expert-2',
    prompt: 'Ba trong số các sứ mệnh này đã sử dụng hỗ trợ hấp dẫn từ Sao Kim. Sứ mệnh nào không?',
    difficulty: 'expert',
    options: [
      { text: 'Galileo', isOddOneOut: false },
      { text: 'MESSENGER', isOddOneOut: false },
      { text: 'Juno', isOddOneOut: true },
      { text: 'Cassini', isOddOneOut: false },
    ],
  },
];

const streetFoodsQuestions: RawQuestion[] = [
  {
    id: 'street-foods-easy-1',
    prompt: 'Ba trong số này là món ăn đường phố truyền thống Nhật Bản. Món nào không phải?',
    difficulty: 'easy',
    options: [
      { text: 'Takoyaki', isOddOneOut: false },
      { text: 'Yakitori', isOddOneOut: false },
      { text: 'Bánh Mì', isOddOneOut: true },
      { text: 'Okonomiyaki', isOddOneOut: false },
    ],
  },
  {
    id: 'street-foods-easy-2',
    prompt: 'Món nào trong số này không phải là món ăn đường phố Mexico?',
    difficulty: 'easy',
    options: [
      { text: 'Tacos al Pastor', isOddOneOut: false },
      { text: 'Elote', isOddOneOut: false },
      { text: 'Poutine', isOddOneOut: true },
      { text: 'Churros', isOddOneOut: false },
    ],
  },
  {
    id: 'street-foods-easy-3',
    prompt: 'Ba trong số này là món ăn vặt đường phố phổ biến của Ấn Độ. Món nào không phải?',
    difficulty: 'easy',
    options: [
      { text: 'Samosa', isOddOneOut: false },
      { text: 'Pani Puri', isOddOneOut: false },
      { text: 'Empanada', isOddOneOut: true },
      { text: 'Vada Pav', isOddOneOut: false },
    ],
  },
  {
    id: 'street-foods-medium-1',
    prompt: 'Món ăn đường phố nào không có nguồn gốc từ Đông Nam Á?',
    difficulty: 'medium',
    options: [
      { text: 'Satay', isOddOneOut: false },
      { text: 'Halo-Halo', isOddOneOut: false },
      { text: 'Arepas', isOddOneOut: true },
      { text: 'Som Tam', isOddOneOut: false },
    ],
  },
  {
    id: 'street-foods-medium-2',
    prompt: 'Ba trong số này là các loại bánh bao. Món nào không phải?',
    difficulty: 'medium',
    options: [
      { text: 'Gyoza', isOddOneOut: false },
      { text: 'Momo', isOddOneOut: false },
      { text: 'Falafel', isOddOneOut: true },
      { text: 'Pierogi', isOddOneOut: false },
    ],
  },
  {
    id: 'street-foods-medium-3',
    prompt: 'Ba trong số này là món ăn đường phố phổ biến ở Trung Đông. Món nào không phải?',
    difficulty: 'medium',
    options: [
      { text: 'Falafel', isOddOneOut: false },
      { text: 'Shawarma', isOddOneOut: false },
      { text: 'Currywurst', isOddOneOut: true },
      { text: 'Manakish', isOddOneOut: false },
    ],
  },
  {
    id: 'street-foods-hard-1',
    prompt: 'Món ăn đường phố nào không có gạo là nguyên liệu chính?',
    difficulty: 'hard',
    options: [
      { text: 'Onigiri', isOddOneOut: false },
      { text: 'Jollof Rice', isOddOneOut: false },
      { text: 'Bunny Chow', isOddOneOut: true },
      { text: 'Nasi Goreng', isOddOneOut: false },
    ],
  },
  {
    id: 'street-foods-hard-2',
    prompt: 'Ba trong số các món ăn đường phố này theo truyền thống được chiên ngập dầu. Món nào không?',
    difficulty: 'hard',
    options: [
      { text: 'Churros', isOddOneOut: false },
      { text: 'Beignets', isOddOneOut: false },
      { text: 'Crêpes', isOddOneOut: true },
      { text: 'Pakora', isOddOneOut: false },
    ],
  },
  {
    id: 'street-foods-hard-3',
    prompt: 'Thành phố nào không được xem là thủ đô ẩm thực đường phố thế giới?',
    difficulty: 'hard',
    options: [
      { text: 'Bangkok', isOddOneOut: false },
      { text: 'Singapore', isOddOneOut: false },
      { text: 'Zurich', isOddOneOut: true },
      { text: 'Mexico City', isOddOneOut: false },
    ],
  },
  {
    id: 'street-foods-expert-1',
    prompt: 'Loại bánh mì dẹt nào không được nướng truyền thống trong lò tandoor?',
    difficulty: 'expert',
    options: [
      { text: 'Naan', isOddOneOut: false },
      { text: 'Tandoori Roti', isOddOneOut: false },
      { text: 'Tortilla', isOddOneOut: true },
      { text: 'Kulcha', isOddOneOut: false },
    ],
  },
  {
    id: 'street-foods-expert-2',
    prompt: 'Ba trong số các loại nước chấm này có ớt làm nguyên liệu chính. Loại nào không?',
    difficulty: 'expert',
    options: [
      { text: 'Sriracha', isOddOneOut: false },
      { text: 'Harissa', isOddOneOut: false },
      { text: 'Tzatziki', isOddOneOut: true },
      { text: 'Sambal', isOddOneOut: false },
    ],
  },
];

const worldHistoryQuestions: RawQuestion[] = [
  {
    id: 'world-history-easy-1',
    prompt: 'Ba trong số này là thành bang Hy Lạp cổ đại. Thành bang nào không phải?',
    difficulty: 'easy',
    options: [
      { text: 'Athens', isOddOneOut: false },
      { text: 'Sparta', isOddOneOut: false },
      { text: 'Carthage', isOddOneOut: true },
      { text: 'Corinth', isOddOneOut: false },
    ],
  },
  {
    id: 'world-history-easy-2',
    prompt: 'Quốc gia nào trong số này không phải là phe Trục trong Thế chiến II?',
    difficulty: 'easy',
    options: [
      { text: 'Đức', isOddOneOut: false },
      { text: 'Nhật Bản', isOddOneOut: false },
      { text: 'Vương quốc Anh', isOddOneOut: true },
      { text: 'Ý', isOddOneOut: false },
    ],
  },
  {
    id: 'world-history-easy-3',
    prompt: 'Ba trong số các nhân vật này gắn liền với Cách mạng Pháp. Ai không?',
    difficulty: 'easy',
    options: [
      { text: 'Robespierre', isOddOneOut: false },
      { text: 'Napoleon Bonaparte', isOddOneOut: false },
      { text: 'Otto von Bismarck', isOddOneOut: true },
      { text: 'Marie Antoinette', isOddOneOut: false },
    ],
  },
  {
    id: 'world-history-medium-1',
    prompt: 'Sự kiện nào không xảy ra trong thế kỷ 18?',
    difficulty: 'medium',
    options: [
      { text: 'Cách mạng Mỹ', isOddOneOut: false },
      { text: 'Cách mạng Pháp', isOddOneOut: false },
      { text: 'Cách mạng Nga', isOddOneOut: true },
      { text: 'Cách mạng Công nghiệp bắt đầu', isOddOneOut: false },
    ],
  },
  {
    id: 'world-history-medium-2',
    prompt: 'Ba trong số các nhà thám hiểm này đi biển cho Tây Ban Nha. Ai không?',
    difficulty: 'medium',
    options: [
      { text: 'Christopher Columbus', isOddOneOut: false },
      { text: 'Ferdinand Magellan', isOddOneOut: false },
      { text: 'Vasco da Gama', isOddOneOut: true },
      { text: 'Hernán Cortés', isOddOneOut: false },
    ],
  },
  {
    id: 'world-history-medium-3',
    prompt: 'Kỳ quan cổ đại nào không nằm ở vùng Địa Trung Hải?',
    difficulty: 'medium',
    options: [
      { text: 'Tượng thần Mặt Trời ở Rhodes', isOddOneOut: false },
      { text: 'Ngọn hải đăng Alexandria', isOddOneOut: false },
      { text: 'Vườn treo Babylon', isOddOneOut: true },
      { text: 'Đền thờ Artemis ở Ephesus', isOddOneOut: false },
    ],
  },
  {
    id: 'world-history-hard-1',
    prompt: 'Hiệp ước nào không kết thúc một cuộc chiến tranh lớn ở châu Âu?',
    difficulty: 'hard',
    options: [
      { text: 'Hiệp ước Versailles', isOddOneOut: false },
      { text: 'Hiệp ước Westphalia', isOddOneOut: false },
      { text: 'Hiệp ước Tordesillas', isOddOneOut: true },
      { text: 'Hiệp ước Utrecht', isOddOneOut: false },
    ],
  },
  {
    id: 'world-history-hard-2',
    prompt: 'Ba trong số các triều đại này đã cai trị Trung Quốc. Triều đại nào không?',
    difficulty: 'hard',
    options: [
      { text: 'Nhà Đường', isOddOneOut: false },
      { text: 'Nhà Tống', isOddOneOut: false },
      { text: 'Đế chế Mughal', isOddOneOut: true },
      { text: 'Nhà Thanh', isOddOneOut: false },
    ],
  },
  {
    id: 'world-history-hard-3',
    prompt: 'Triết gia nào không phải người Hy Lạp cổ đại?',
    difficulty: 'hard',
    options: [
      { text: 'Socrates', isOddOneOut: false },
      { text: 'Plato', isOddOneOut: false },
      { text: 'Khổng Tử', isOddOneOut: true },
      { text: 'Aristotle', isOddOneOut: false },
    ],
  },
  {
    id: 'world-history-expert-1',
    prompt: 'Ba trong số các cuộc cách mạng này xảy ra vào năm 1848. Cuộc cách mạng nào không?',
    difficulty: 'expert',
    options: [
      { text: 'Cách mạng tháng Hai Pháp', isOddOneOut: false },
      { text: 'Cách mạng Hungary', isOddOneOut: false },
      { text: 'Cách mạng Haiti', isOddOneOut: true },
      { text: 'Cách mạng tháng Ba Đức', isOddOneOut: false },
    ],
  },
  {
    id: 'world-history-expert-2',
    prompt: 'Tác phẩm nào không được viết trong thời kỳ Khai sáng?',
    difficulty: 'expert',
    options: [
      { text: 'Khế ước Xã hội của Rousseau', isOddOneOut: false },
      { text: 'Tinh thần Pháp luật của Montesquieu', isOddOneOut: false },
      { text: 'Leviathan của Hobbes', isOddOneOut: true },
      { text: 'Tiểu luận về Nhận thức Con người', isOddOneOut: false },
    ],
  },
];

const popMusicQuestions: RawQuestion[] = [
  {
    id: 'pop-music-easy-1',
    prompt: 'Ba trong số các nghệ sĩ này là thành viên BTS. Ai không phải?',
    difficulty: 'easy',
    options: [
      { text: 'Jungkook', isOddOneOut: false },
      { text: 'V', isOddOneOut: false },
      { text: 'G-Dragon', isOddOneOut: true },
      { text: 'RM', isOddOneOut: false },
    ],
  },
  {
    id: 'pop-music-easy-2',
    prompt: 'Bài hát nào trong số này không phải của Michael Jackson?',
    difficulty: 'easy',
    options: [
      { text: 'Thriller', isOddOneOut: false },
      { text: 'Billie Jean', isOddOneOut: false },
      { text: 'Purple Rain', isOddOneOut: true },
      { text: 'Beat It', isOddOneOut: false },
    ],
  },
  {
    id: 'pop-music-easy-3',
    prompt: 'Ba trong số này là album của Taylor Swift. Album nào không phải?',
    difficulty: 'easy',
    options: [
      { text: '1989', isOddOneOut: false },
      { text: 'Folklore', isOddOneOut: false },
      { text: 'Lemonade', isOddOneOut: true },
      { text: 'Midnights', isOddOneOut: false },
    ],
  },
  {
    id: 'pop-music-medium-1',
    prompt: 'Nghệ sĩ nào không từng tham gia một bộ đôi nhạc pop nổi tiếng?',
    difficulty: 'medium',
    options: [
      { text: 'Sonny Bono', isOddOneOut: false },
      { text: 'Andrew Ridgeley', isOddOneOut: false },
      { text: 'Freddie Mercury', isOddOneOut: true },
      { text: 'John Oates', isOddOneOut: false },
    ],
  },
  {
    id: 'pop-music-medium-2',
    prompt: 'Ba trong số các nghệ sĩ này đã biểu diễn tại Super Bowl halftime show. Ai chưa?',
    difficulty: 'medium',
    options: [
      { text: 'Beyoncé', isOddOneOut: false },
      { text: 'Lady Gaga', isOddOneOut: false },
      { text: 'Adele', isOddOneOut: true },
      { text: 'Shakira', isOddOneOut: false },
    ],
  },
  {
    id: 'pop-music-medium-3',
    prompt: 'Nghệ sĩ nào trong số này không đến từ Vương quốc Anh?',
    difficulty: 'medium',
    options: [
      { text: 'Adele', isOddOneOut: false },
      { text: 'Ed Sheeran', isOddOneOut: false },
      { text: 'Drake', isOddOneOut: true },
      { text: 'Dua Lipa', isOddOneOut: false },
    ],
  },
  {
    id: 'pop-music-hard-1',
    prompt: 'Ba trong số các nghệ sĩ này tự sáng tác hầu hết bài hit của mình. Ai không?',
    difficulty: 'hard',
    options: [
      { text: 'Billie Eilish', isOddOneOut: false },
      { text: 'Taylor Swift', isOddOneOut: false },
      { text: 'Britney Spears', isOddOneOut: true },
      { text: 'Lady Gaga', isOddOneOut: false },
    ],
  },
  {
    id: 'pop-music-hard-2',
    prompt: 'Lễ hội âm nhạc nào không diễn ra tại Hoa Kỳ?',
    difficulty: 'hard',
    options: [
      { text: 'Coachella', isOddOneOut: false },
      { text: 'Lollapalooza', isOddOneOut: false },
      { text: 'Glastonbury', isOddOneOut: true },
      { text: 'Bonnaroo', isOddOneOut: false },
    ],
  },
  {
    id: 'pop-music-hard-3',
    prompt: 'Thể loại âm nhạc nào trong số này không bắt nguồn từ Hoa Kỳ?',
    difficulty: 'hard',
    options: [
      { text: 'Jazz', isOddOneOut: false },
      { text: 'Hip-Hop', isOddOneOut: false },
      { text: 'Reggae', isOddOneOut: true },
      { text: 'Rock and Roll', isOddOneOut: false },
    ],
  },
  {
    id: 'pop-music-expert-1',
    prompt: 'Nghệ sĩ nào trong số này không xuất thân từ một chương trình tìm kiếm tài năng?',
    difficulty: 'expert',
    options: [
      { text: 'Kelly Clarkson', isOddOneOut: false },
      { text: 'One Direction', isOddOneOut: false },
      { text: 'Billie Eilish', isOddOneOut: true },
      { text: 'Fifth Harmony', isOddOneOut: false },
    ],
  },
  {
    id: 'pop-music-expert-2',
    prompt: 'Hãng thu âm nào không thuộc "Ba ông lớn" của ngành công nghiệp âm nhạc?',
    difficulty: 'expert',
    options: [
      { text: 'Universal Music Group', isOddOneOut: false },
      { text: 'Sony Music', isOddOneOut: false },
      { text: 'Def Jam Recordings', isOddOneOut: true },
      { text: 'Warner Music Group', isOddOneOut: false },
    ],
  },
];

const questionMap: Record<string, RawQuestion[]> = {
  football: footballQuestions,
  anime: animeQuestions,
  science: scienceQuestions,
  'space-explorers': spaceExplorersQuestions,
  'street-foods': streetFoodsQuestions,
  'world-history': worldHistoryQuestions,
  'pop-music': popMusicQuestions,
};

export function getFallbackQuestion(
  themeId: string,
  difficulty: DifficultyLevel,
  excludedIds: Set<string>,
): GameQuestion | null {
  const pool = questionMap[themeId]?.filter(
    (question) => question.difficulty === difficulty && !excludedIds.has(question.id),
  );

  const available = pool && pool.length > 0
    ? pool
    : questionMap[themeId]?.filter((question) => !excludedIds.has(question.id));

  if (!available || available.length === 0) {
    return null;
  }

  const selection = available[Math.floor(Math.random() * available.length)];
  const oddOptionIndex = selection.options.findIndex((option) => option.isOddOneOut);

  if (oddOptionIndex === -1) {
    return null;
  }

  const options = selection.options.map((option, index) => ({
    id: `${selection.id}-option-${index}`,
    text: option.text,
    isOddOneOut: option.isOddOneOut,
  }));

  return {
    id: selection.id,
    seed: randomUUID(),
    prompt: selection.prompt,
    themeId,
    difficulty: selection.difficulty,
    options,
    oddOptionId: `${selection.id}-option-${oddOptionIndex}`,
    source: 'fallback',
    generatedAt: new Date().toISOString(),
  };
}
