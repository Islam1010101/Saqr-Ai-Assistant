export type ShelfAudience='specialist'|'youth'|'youthTeens'|'children'|'nationalIdentity'|'review';
export const audienceByShelf=(shelf:number):ShelfAudience=>{
 if(shelf===41)return 'nationalIdentity';
 if(shelf===37)return 'children';
 if((shelf>=1&&shelf<=12)||(shelf>=16&&shelf<=21)||(shelf>=31&&shelf<=33)||shelf===39)return 'specialist';
 if(shelf>=13&&shelf<=15)return 'youth';
 if((shelf>=22&&shelf<=30)||shelf===35||shelf===36||shelf===38||shelf===40)return 'youthTeens';
 return 'review';
};
