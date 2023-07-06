const {
    SlashCommandBuilder,
    EmbedBuilder,
    ButtonBuilder,
    ActionRowBuilder,
  } = require("discord.js");
  const fs = require("fs");
  let is = 1;
  module.exports = {
    data: new SlashCommandBuilder().setName("挖礦").setDescription("挖呀挖呀挖"),
    async execute(client, interaction) {
      const data = fs.readFileSync("players.json"); //調取資料庫
      let players = JSON.parse(data);
      let chk = 0,
        ind = 0;
      for (let i = 0; i < players.length; i++) {
        if (players[i].id == interaction.user.id) {
          chk = 1;
          ind = i;
          let money = players[i].money;
        }
      }
      const st = new EmbedBuilder().setTitle("Start Mine").setDescription("⛏⛏⛏").setfooter("你目前有" + money + "元");
      await interaction.reply({ embeds: [st] });
      while (is) {
        const embed = new EmbedBuilder()
          .setTitle("前方三條岔路")
          .setDescription("請選擇前進方向");
        const buttonleft = new ButtonBuilder()
          .setStyle(ButtonStyle.Primary)
          .setCustomId("left")
          .setLabel("⬅️");
        const buttonright = new ButtonBuilder()
          .setStyle(ButtonStyle.Primary)
          .setCustomId("right")
          .setLabel("➡️");
        const buttonmiddle = new ButtonBuilder()
          .setStyle(ButtonStyle.Primary)
          .setCustomId("middle")
          .setLabel("⬆️");
        const buttonquit = new ButtonBuilder()
          .setStyle(ButtonStyle.Destructive)
          .setCustomId("quit")
          .setLabel(" ↩️");
        const row = new ActionRowBuilder().addComponents(
          buttonleft,
          buttonmiddle,
          buttonright,
          buttonquit
        );
  
        await interaction.followup({ embeds: [embed], component: [row] });
        const collector = interaction.channel.createMessageComponentCollector({
          time: 15000,
        });
        collector.on("collect", async (collected) => {
          let choice = Math.floor(Math.random() * 99);
          let earning = 0;
  
          if (choice >= 0 && choice < 5) {
            //鑽石5%
            await interaction.reply("恭喜挖到鑽石!");
            earning += 1000;
          } else if (choice >= 5 && choice < 15) {
            //金10%
            await interaction.reply("挖到金礦");
            earning += 300;
          } else if (choice >= 15 && choice < 30) {
            //鐵15%
            await interaction.reply("挖到鐵礦");
            earning += 100;
          } else if (choice >= 30 && choice < 50) {
            //煤20%
            await interaction.reply("挖到煤礦");
            earning += 50;
          } else if (choice >= 50 && choice < 62) {
            //岩漿 12%
            await interaction.reply("Bruh🗿");
            is = 0;
            earning -= 50;
          } else if (choice >= 62 && choice < 75) {
            //怪物襲擊 13%
            await interaction.reply("被creeper炸爛");
            is = 0;
            earning -= 100;
          } else if (choice >= 75 && choice < 99) {
            //石頭 25%
            await interaction.reply("挖到石頭");
            earning += 0;
          }
  
          money += earning;
  
          const json = JSON.stringify(players);
          fs.writeFileSync("players.json", json);
        });
      }
    },
  };
  