class AvatarGenerator {
    avatarStyles = [
        'adventurer',
        'adventurer-neutral',
        'avataaars',
        'avataaars-neutral',
        'big-ears',
        'big-ears-neutral',
        'big-smile',
        'bottts',
        'bottts-neutral',
        'croodles',
        'croodles-neutral',
        'fun-emoji',
        'icons',
        'identicon',
        'initials',
        'lorelei',
        'lorelei-neutral',
        'micah',
        'miniavs',
        'open-peeps',
        'personas',
        'pixel-art',
        'pixel-art-neutral',
        'shapes',
        'thumbs'
    ];


    _getRandomAvatarStyle() {
        const randomIndex = Math.floor(Math.random() * this.avatarStyles.length);
        return this.avatarStyles[randomIndex];
    }


    async generateRandomAvatar(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        const _email = email.replaceAll(' ', '');


        const isValidEmail = emailRegex.test(_email);
        if (!isValidEmail) {
            throw new Error('Invalid email')
        }


        const entropySource = () => Math.random().toString(36).substring(2, 7);


        const replaceAt = `-${entropySource()}-`
        const replaceDot = `-${entropySource()}-`


        const seed = _email.replace('@', replaceAt).replaceAll('.', replaceDot);


        const randomAvatarStyle = this._getRandomAvatarStyle();


        if (!randomAvatarStyle || !this.avatarStyles.includes(randomAvatarStyle)) {
            // console.error('Invalid avatar style') // log this error to the console
            throw new Error('Something failed: ')
        }


        const avatarUrl = `https://api.dicebear.com/5.x/${randomAvatarStyle}/svg?seed=${seed}&size=200&radius=50`;


        return avatarUrl;


    }

}

module.exports = new AvatarGenerator();

