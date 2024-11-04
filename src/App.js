import { Console, MissionUtils, Random } from "@woowacourse/mission-utils"
import Lotto from './Lotto.js';

class App {
  async run() {
    const USER_MONEY = await this.getMoney();
    const USER_LOTTO = this.makeUserLotto(USER_MONEY);
    this.printUserLotto(USER_MONEY, USER_LOTTO);
    const WIN_NUM = await this.getWinNum();
    const lotto = new Lotto(WIN_NUM);
    const BONUS_NUM = await this.getBonusNum(WIN_NUM);
    lotto.getResult(USER_MONEY, USER_LOTTO, BONUS_NUM);
  }

  async getMoney() {
    let inputMoney = await Console.readLineAsync("구입금액을 입력해 주세요.\n");
    return this.checkMoney(Number(inputMoney));
  }

  checkMoney(money) {
    if (isNaN(money)) {
      throw new Error("[ERROR] 입력된 값이 숫자가 아닙니다.");
    }
    if (money % 1000 !== 0) {
      throw new Error("[ERROR] 로또 구입금액이 1000원 단위가 아닙니다.")
    }
    return money;
  }

  makeUserLotto(money) {
    let count = Math.floor(money / 1000);
    let userLotto = []
    for (let i = 0; i < count; i++) {
      let oneLotto = MissionUtils.Random.pickUniqueNumbersInRange(1, 45, 6).sort((a, b) => a - b);
      while (userLotto.some(lotto => JSON.stringify(lotto) === JSON.stringify(oneLotto))) {
        oneLotto = MissionUtils.Random.pickUniqueNumbersInRange(1, 45, 6).sort((a, b) => a - b);
      }
      userLotto.push(oneLotto);
    }
    return userLotto;
  }

  printUserLotto(money, lottos) {
    Console.print(`\n${Math.floor(money / 1000)}개를 구매했습니다.`);
    for (let lotto of lottos) {
      Console.print(lotto)
    }
  }

  async getWinNum() {
    let winNum = await Console.readLineAsync("\n당첨 번호를 입력해 주세요.\n");
    let winArray = winNum.replace(/\s/g, "").split(',').map(Number);
    return winArray;
  }

  async getBonusNum(winArray) {
    let bonusNum = await Console.readLineAsync("\n보너스 번호를 입력해 주세요.\n");
    this.checkBonus(bonusNum, winArray);
    return Number(bonusNum);
  }

  checkBonus(bonus, numbers) {
    if (isNaN(bonus)) {
      throw new Error("[ERROR] 숫자 하나를 입력해야 합니다.");
    }
    if (numbers.include(bonus)) {
      throw new Error("[ERROR] 보너스 번호가 당첨 번호와 중복됩니다.");
    }
  }


}

export default App;
