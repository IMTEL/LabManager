export type UserActions = {
    deleteUser: (id: number) => void;
};

export class UserClass {
    constructor(
        public id: number,
        public username: string,
        public createdAt: Date,
        public latestActivity: Date,
        private actions: UserActions
    ) {}


    delete() {
        this.actions.deleteUser(this.id);
    }
}