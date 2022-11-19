import bcrypt from 'bcryptjs';

export class Password {
  constructor(private readonly value: string) {}

  isMatching(hash: string): boolean {
    return bcrypt.compareSync(this.value, hash);
  }

  hash() {
    return bcrypt.hashSync(this.value);
  }
}
