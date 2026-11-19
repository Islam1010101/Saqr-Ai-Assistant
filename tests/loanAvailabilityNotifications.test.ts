import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { getPhysicalLoanBadge, normalizedBookTitle, type PublicActiveLoan } from '../src/utils/physicalLoanAvailability.ts';

const book={title:'Science Book',shelf:29,row:3};
const loan:PublicActiveLoan={book_name:'Science Book',book_shelf:'29',book_row:'3'};
const counts=new Map([[normalizedBookTitle(book.title),1]]);
assert.equal(getPhysicalLoanBadge(book,[loan],counts),'out');
assert.equal(getPhysicalLoanBadge({...book,row:4},[loan],counts),null);
assert.equal(getPhysicalLoanBadge({...book,copies:2},[loan],counts),'some');
assert.equal(getPhysicalLoanBadge(book,[],counts),null);
assert.equal(getPhysicalLoanBadge(book,[{book_name:book.title,book_shelf:null,book_row:null}],counts),'out');
assert.equal(getPhysicalLoanBadge(book,[{book_name:book.title,book_shelf:null,book_row:null}],new Map([[normalizedBookTitle(book.title),2]]),'some');

const home=readFileSync('pages/HomePage.tsx','utf8');
assert.ok(home.includes("!['student','teacher','admin'].includes(role)"), 'All established roles see own notifications');
assert.equal(home.split('if (!isNotifiableBorrowing(row)) return;').length-1,2);
assert.ok(home.includes('!isPending && validReturnDate'), 'Pending requests do not display return countdown');
const catalog=readFileSync('pages/SearchPage.tsx','utf8');
assert.ok(catalog.includes("action: 'availability'"));
assert.ok(catalog.includes('getPhysicalLoanBadge(book, activeLoans, titleCounts)'));
const edge=readFileSync('supabase/functions/admin-verified-library/index.ts','utf8');
assert.ok(edge.includes('if(action==="availability")'));
assert.ok(edge.includes('.select("book_name,book_shelf,book_row")'), 'Never share borrowers in catalog');
assert.ok(edge.includes('if(staff?.role!=="admin")return res(403,{error:"Admin required"});'), 'Admin management still restricted');
console.log('PASS borrower notifications and privacy-safe checked-out badges');
