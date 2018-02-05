const localStorageSaveItem = 'save';

export default class IO {
  public static writeSave(save: string) {
    this.browserWriteSave(save);
  }

  public static readSave(): string {
    return this.browserReadSave();
  }

  private static browserWriteSave(save: string) {
    localStorage.setItem(localStorageSaveItem, save);
  }

  private static browserReadSave(): string {
    return localStorage.getItem(localStorageSaveItem);
  }
}
