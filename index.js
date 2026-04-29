const TYPE_COLORS = {
  "ノーマル": { bg: "#A8A87822", border: "#A8A87888", color: "#c8c870" },
  "ほのお": { bg: "#F0803022", border: "#F0803088", color: "#F08030" },
  "みず": { bg: "#6890F022", border: "#6890F088", color: "#6890F0" },
  "でんき": { bg: "#F8D03022", border: "#F8D03088", color: "#F8D030" },
  "くさ": { bg: "#78C85022", border: "#78C85088", color: "#78C850" },
  "こおり": { bg: "#98D8D822", border: "#98D8D888", color: "#98D8D8" },
  "かくとう": { bg: "#C0302822", border: "#C0302888", color: "#e05048" },
  "どく": { bg: "#A040A022", border: "#A040A088", color: "#c060c0" },
  "じめん": { bg: "#E0C06822", border: "#E0C06888", color: "#E0C068" },
  "ひこう": { bg: "#A890F022", border: "#A890F088", color: "#A890F0" },
  "エスパー": { bg: "#F8588822", border: "#F8588888", color: "#F85888" },
  "むし": { bg: "#A8B82022", border: "#A8B82088", color: "#A8B820" },
  "いわ": { bg: "#B8A03822", border: "#B8A03888", color: "#d8c058" },
  "ゴースト": { bg: "#70589822", border: "#70589888", color: "#9070b8" },
  "ドラゴン": { bg: "#7038F822", border: "#7038F888", color: "#9060f8" },
  "あく": { bg: "#70584822", border: "#70584888", color: "#907868" },
  "はがね": { bg: "#B8B8D022", border: "#B8B8D088", color: "#B8B8D0" },
  "フェアリー": { bg: "#EE99AC22", border: "#EE99AC88", color: "#EE99AC" },
};

function getBadgeStyle(typeName) {
  const c = TYPE_COLORS[typeName];
  if (!c) return `background:#ffffff22; border:1px solid #ffffff44; color:#fff;`;
  return `background:${c.bg}; border:1px solid ${c.border}; color:${c.color};`;
}

async function buttonClicked(id) {
  if (!id) return;
  const msg = document.getElementById("loading-msg");
  msg.textContent = "Loading...";
  document.getElementById("pokemon-card").classList.remove("visible");

  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await res.json();
    document.getElementById("pokemon-image").src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
    document.getElementById("poke-id").textContent = `#${String(id).padStart(4, '0')}`;

    const namePromise = getJapaneseName(id);
    const typePromises = data.types.map(t => getJapaneseType(t.type.name));
    const [japaneseName, ...japaneseTypes] = await Promise.all([namePromise, ...typePromises]);

    document.getElementById("poke-name").textContent = japaneseName;

    const badgesEl = document.getElementById("type-badges");
    badgesEl.innerHTML = japaneseTypes
      .map(t => `<span class="badge" style="${getBadgeStyle(t)}">${t}</span>`)
      .join("");

    msg.textContent = "";
    document.getElementById("pokemon-card").classList.add("visible");
  } catch (e) {
    msg.textContent = "取得に失敗しました";
  }
}

async function getJapaneseName(id) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
  const data = await res.json();
  const jaName = data.names.find(n => n.language.name === "ja");
  return jaName ? jaName.name : "No name";
}

async function getJapaneseType(typeName) {
  const res = await fetch(`https://pokeapi.co/api/v2/type/${typeName}`);
  const data = await res.json();
  const jaType = data.names.find(n => n.language.name === "ja");
  return jaType ? jaType.name : typeName;
}